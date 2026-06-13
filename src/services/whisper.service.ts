// configuracion del llm groq y whisper

import Groq from "groq-sdk";
import { toFile } from "openai";
import { env } from "../config/env";

// Configuracion Groq:

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

// Funcion para transcribir audio a texto:

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {

  // convierte el buffer del audio en un archivo compatible con whisper
  const audioFile = await toFile(
    audioBuffer,
    "audio.webm",
    { type: "audio/webm" }
  );

  // envia el audio a whisper y trae la transcripcion
  const transcription = await groq.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-large-v3",
    language: "es"
  });

  return transcription.text;
}