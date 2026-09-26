import { EMBEDDING, LLM_PROVIDER, RETRY, WHISPER } from "../../config/llm.config";
import { FallbackLLMProvider } from "./providers/fallbackLLM.provider";
import { GeminiEmbeddingProvider } from "./providers/geminiEmbedding.provider";
import { GroqLLMProvider } from "./providers/groqLLM.provider";
import { GroqWhisperProvider } from "./providers/groqWhisper.provider";
import type { EmbeddingProvider, LLMProvider, TranscriptionProvider } from "../../types/llm.types";

let llmProvider: LLMProvider | undefined;
let transcriptionProvider: TranscriptionProvider | undefined;
let embeddingProvider: EmbeddingProvider | undefined;

export function getLLMProvider(): LLMProvider {
  if (!llmProvider) {
    const { primary, fallback, retry } = LLM_PROVIDER;
    const primaryProvider = new GroqLLMProvider(primary, retry);

    llmProvider = fallback
      ? new FallbackLLMProvider([primaryProvider, new GroqLLMProvider(fallback, retry)])
      : primaryProvider;
  }

  return llmProvider;
}

export function getTranscriptionProvider(): TranscriptionProvider {
  transcriptionProvider ??= new GroqWhisperProvider(WHISPER, RETRY);

  return transcriptionProvider;
}

export function getEmbeddingProvider(): EmbeddingProvider {
  embeddingProvider ??= new GeminiEmbeddingProvider(EMBEDDING, RETRY);

  return embeddingProvider;
}
