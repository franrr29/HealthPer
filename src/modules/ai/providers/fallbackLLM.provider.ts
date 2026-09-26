import type { ZodType } from "zod";
import { logger } from "../../../config/logger";
import { ExternalServiceError } from "../../../errors";
import type { LLMProvider } from "../../../types/llm.types";

export class FallbackLLMProvider implements LLMProvider {
  private readonly providers: readonly LLMProvider[];

  constructor(providers: readonly LLMProvider[]) {
    this.providers = providers;
  }

  generateText(prompt: string, systemPrompt?: string): Promise<string> {
    return this.runWithFallback((provider) => provider.generateText(prompt, systemPrompt));
  }

  generateJSON<T>(prompt: string, systemPrompt?: string, schema?: ZodType<T>): Promise<T> {
    return this.runWithFallback((provider) => provider.generateJSON<T>(prompt, systemPrompt, schema));
  }

  private async runWithFallback<T>(call: (provider: LLMProvider) => Promise<T>): Promise<T> {
    let lastError: ExternalServiceError | undefined;

    for (const [index, provider] of this.providers.entries()) {
      try {
        return await call(provider);
      } catch (error) {
        // only upstream failures justify trying another provider
        if (!(error instanceof ExternalServiceError)) {
          throw error;
        }

        lastError = error;

        if (index < this.providers.length - 1) {
          logger.warn({ provider: error.provider }, "llm provider failed, trying fallback");
        }
      }
    }

    throw lastError ?? new ExternalServiceError("No LLM provider available");
  }
}
