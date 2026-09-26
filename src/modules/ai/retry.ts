import { logger } from "../../config/logger";
import { RATE_LIMIT_WARNING_THRESHOLD } from "../../config/llm.config";
import { AppError, ExternalServiceError } from "../../errors";
import type { RetryConfig } from "../../types/llm.types";

interface HeadersLike {
  get(name: string): string | null;
}

interface ErrorLike {
  status?: unknown;
  code?: unknown;
  type?: unknown;
  name?: unknown;
  message?: unknown;
  headers?: HeadersLike;
  cause?: ErrorLike;
}

type RetryableKind = "rate_limit" | "server_error" | "timeout" | "network";

const RATE_LIMIT_REMAINING_HEADERS = [
  "x-ratelimit-remaining",
  "x-ratelimit-remaining-requests",
  "x-ratelimit-remaining-tokens",
];

const TIMEOUT_CODES = new Set(["ETIMEDOUT", "ESOCKETTIMEDOUT"]);
const NETWORK_CODES = new Set(["ECONNRESET", "ECONNREFUSED", "EPIPE"]);
const TIMEOUT_ERROR_NAMES = new Set(["APIConnectionTimeoutError", "TimeoutError"]);

function asErrorLike(error: unknown): ErrorLike {
  return typeof error === "object" && error !== null ? (error as ErrorLike) : {};
}

function getStatus(error: ErrorLike): number | undefined {
  return typeof error.status === "number" ? error.status : undefined;
}

// sdks wrap the low level socket error in `cause`
function getCode(error: ErrorLike): string | undefined {
  const code = error.code ?? error.cause?.code;

  return typeof code === "string" ? code : undefined;
}

function getRetryableKind(error: ErrorLike): RetryableKind | undefined {
  const status = getStatus(error);

  if (status === 429) return "rate_limit";
  if (status !== undefined) return status >= 500 ? "server_error" : undefined;

  const code = getCode(error);

  if (
    (code !== undefined && TIMEOUT_CODES.has(code)) ||
    error.type === "request-timeout" ||
    (typeof error.name === "string" && TIMEOUT_ERROR_NAMES.has(error.name))
  ) {
    return "timeout";
  }

  if (
    (code !== undefined && NETWORK_CODES.has(code)) ||
    error.name === "APIConnectionError" ||
    error.message === "fetch failed"
  ) {
    return "network";
  }

  return undefined;
}

function readHeader(error: ErrorLike, name: string): string | undefined {
  return error.headers?.get?.(name) ?? undefined;
}

function warnIfRateLimitLow(error: ErrorLike, provider: string): void {
  for (const header of RATE_LIMIT_REMAINING_HEADERS) {
    const remaining = Number(readHeader(error, header));

    if (!Number.isNaN(remaining) && remaining <= RATE_LIMIT_WARNING_THRESHOLD) {
      logger.warn({ provider, header, remaining }, "external api rate limit almost exhausted");
    }
  }
}

function getDelay(error: ErrorLike, attempt: number, retry: RetryConfig): number {
  const backoff = Math.min(
    retry.baseDelay * 2 ** attempt + Math.random() * retry.baseDelay,
    retry.maxDelay
  );

  const retryAfterSeconds = Number(readHeader(error, "retry-after"));
  const retryAfter = Number.isNaN(retryAfterSeconds) ? 0 : Math.min(retryAfterSeconds * 1000, retry.maxDelay);

  return Math.max(backoff, retryAfter);
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  retry: RetryConfig,
  provider: string
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      const errorLike = asErrorLike(error);
      const kind = getRetryableKind(errorLike);
      const status = getStatus(errorLike);

      warnIfRateLimitLow(errorLike, provider);

      if (!kind || attempt >= retry.maxRetries) {
        logger.warn(
          { provider, kind, status, attempts: attempt + 1, reason: (error as Error).message },
          "external call failed"
        );

        throw new ExternalServiceError(`${provider} request failed`, provider);
      }

      const delayMs = getDelay(errorLike, attempt, retry);

      logger.warn({ provider, kind, status, attempt: attempt + 1, delayMs }, "retrying external call");

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}
