import OpenAI from "openai";
import type { ZodType } from "zod";
import { ExternalServiceError } from "../../../errors";
import { withRetry } from "../retry";
import { groqClient } from "./groqClient";
import type { LLMConfig, LLMProvider, RetryConfig } from "../../../types/llm.types";

const PROVIDER_NAME = "groq";

export class GroqLLMProvider implements LLMProvider {
  private readonly config: LLMConfig;
  private readonly retry: RetryConfig;
  private readonly client: OpenAI;

  constructor(config: LLMConfig, retry: RetryConfig, client: OpenAI = groqClient) {
    this.config = config;
    this.retry = retry;
    this.client = client;
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    const raw = await this.complete(prompt, systemPrompt, false);

    return raw.trim();
  }

  async generateJSON<T>(prompt: string, systemPrompt?: string, schema?: ZodType<T>): Promise<T> {
    const raw = await this.complete(prompt, systemPrompt, true);

    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new ExternalServiceError("LLM returned invalid JSON", PROVIDER_NAME);
    }

    if (!schema) {
      return parsed as T;
    }

    const result = schema.safeParse(parsed);

    if (!result.success) {
      throw new ExternalServiceError("LLM response did not match the expected structure", PROVIDER_NAME);
    }

    return result.data;
  }

  private async complete(prompt: string, systemPrompt: string | undefined, isJson: boolean): Promise<string> {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (systemPrompt?.trim()) {
      messages.push({ role: "system", content: systemPrompt });
    }

    messages.push({ role: "user", content: prompt });

    const response = await withRetry(
      () =>
        this.client.chat.completions.create(
          {
            model: this.config.model,
            messages,
            max_completion_tokens: this.config.maxTokens,
            temperature: this.config.temperature,
            ...(isJson && { response_format: { type: "json_object" as const } }),
          },
          { timeout: this.config.timeout }
        ),
      this.retry,
      PROVIDER_NAME
    );

    const content = response.choices[0]?.message.content;

    if (!content) {
      throw new ExternalServiceError("LLM returned empty response", PROVIDER_NAME);
    }

    return content;
  }
}
