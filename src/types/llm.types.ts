import type { ZodType } from "zod";

export interface LLMProvider {
  generateText(prompt: string, systemPrompt?: string): Promise<string>;
  generateJSON<T>(prompt: string, systemPrompt?: string, schema?: ZodType<T>): Promise<T>;
}

export interface TranscriptionProvider {
  transcribe(audioBuffer: Buffer, mimetype: string): Promise<string>;
}

export interface EmbeddingProvider {
  embed(texts: string[]): Promise<number[][]>;
}

export interface LLMConfig {
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
}

export interface TranscriptionConfig {
  model: string;
  timeout: number;
  language: string;
}

export interface EmbeddingConfig {
  model: string;
  timeout: number;
  apiVersion: string;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

export interface ProviderConfig {
  primary: LLMConfig;
  fallback?: LLMConfig;
  retry: RetryConfig;
}
