import { getTranscriptionProvider } from "./llm.factory";

const DEFAULT_AUDIO_MIMETYPE = "audio/webm";

export async function transcribeAudio(
  audioBuffer: Buffer,
  mimetype: string = DEFAULT_AUDIO_MIMETYPE
): Promise<string> {
  return getTranscriptionProvider().transcribe(audioBuffer, mimetype);
}
