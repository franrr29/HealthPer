import type {
  EmbeddingConfig,
  LLMConfig,
  ProviderConfig,
  RetryConfig,
  TranscriptionConfig,
} from "../types/llm.types";

export const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

export const RATE_LIMIT_WARNING_THRESHOLD = 5;

export const LLM_PRIMARY: LLMConfig = {
  model: "openai/gpt-oss-120b",
  maxTokens: 4096,
  temperature: 0.3,
  timeout: 30000,
};

// different model family on purpose: groq rate limits are per model
export const LLM_FALLBACK: LLMConfig = {
  model: "llama-3.3-70b-versatile",
  maxTokens: 4096,
  temperature: 0.3,
  timeout: 30000,
};

export const WHISPER: TranscriptionConfig = {
  model: "whisper-large-v3",
  timeout: 30000,
  language: "es",
};

export const EMBEDDING: EmbeddingConfig = {
  model: "gemini-embedding-001",
  timeout: 15000,
  apiVersion: "v1",
};

export const RETRY: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
};

export const LLM_PROVIDER: ProviderConfig = {
  primary: LLM_PRIMARY,
  fallback: LLM_FALLBACK,
  retry: RETRY,
};
