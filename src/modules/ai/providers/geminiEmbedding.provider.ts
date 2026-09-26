import { GoogleGenAI } from "@google/genai";
import { env } from "../../../config/env";
import { ExternalServiceError } from "../../../errors";
import { withRetry } from "../retry";
import type { EmbeddingConfig, EmbeddingProvider, RetryConfig } from "../../../types/llm.types";

const PROVIDER_NAME = "gemini";

export class GeminiEmbeddingProvider implements EmbeddingProvider {
  private readonly config: EmbeddingConfig;
  private readonly retry: RetryConfig;
  private readonly client: GoogleGenAI;

  constructor(config: EmbeddingConfig, retry: RetryConfig) {
    this.config = config;
    this.retry = retry;
    this.client = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
      httpOptions: { apiVersion: config.apiVersion, timeout: config.timeout },
    });
  }

  // sequential on purpose to stay inside the api rate limits
  async embed(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];

    for (const text of texts) {
      const response = await withRetry(
        () => this.client.models.embedContent({ model: this.config.model, contents: text }),
        this.retry,
        PROVIDER_NAME
      );

      const values = response.embeddings?.[0]?.values;

      if (!values) {
        throw new ExternalServiceError("Embedding response was empty", PROVIDER_NAME);
      }

      embeddings.push(values);
    }

    return embeddings;
  }
}
