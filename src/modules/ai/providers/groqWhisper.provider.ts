import OpenAI, { toFile } from "openai";
import { withRetry } from "../retry";
import { groqClient } from "./groqClient";
import type { RetryConfig, TranscriptionConfig, TranscriptionProvider } from "../../../types/llm.types";

const PROVIDER_NAME = "groq";
const DEFAULT_EXTENSION = "webm";

const EXTENSION_BY_MIMETYPE: Record<string, string> = {
  "audio/webm": "webm",
  "audio/mp4": "mp4",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
};

export class GroqWhisperProvider implements TranscriptionProvider {
  private readonly config: TranscriptionConfig;
  private readonly retry: RetryConfig;
  private readonly client: OpenAI;

  constructor(config: TranscriptionConfig, retry: RetryConfig, client: OpenAI = groqClient) {
    this.config = config;
    this.retry = retry;
    this.client = client;
  }

  async transcribe(audioBuffer: Buffer, mimetype: string): Promise<string> {
    const extension = EXTENSION_BY_MIMETYPE[mimetype] ?? DEFAULT_EXTENSION;
    const audioFile = await toFile(audioBuffer, `audio.${extension}`, { type: mimetype });

    const transcription = await withRetry(
      () =>
        this.client.audio.transcriptions.create(
          {
            file: audioFile,
            model: this.config.model,
            language: this.config.language,
          },
          { timeout: this.config.timeout }
        ),
      this.retry,
      PROVIDER_NAME
    );

    return transcription.text;
  }
}
