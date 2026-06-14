import OpenAI from "openai";
import { env } from "../config/env";
import { SUMMARY_SYSTEM_PROMPT } from "./prompt.service";

//Crear conexion con el LLM:
const groqLLM= new OpenAI ({
    apiKey: env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1" 
});



// Generar resumen con el LLM:

import OpenAI from "openai";
import { env } from "../config/env";


// Crear conexion con el LLM:
const groqLLM = new OpenAI({
    apiKey: env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});



// Generar resumen con el LLM:

export async function generateConsultationSummary(transcript: string) {

    if (!transcript?.trim()) {
        throw new Error("Transcript is required");
    }


    const prompt = buildSummaryPrompt(transcript);


    const messagesLLM = [
        {
            role: "system" as const,
            content: SUMMARY_SYSTEM_PROMPT
        },
        {
            role: "user" as const,
            content: prompt
        }
    ];


    const response = await groqLLM.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: messagesLLM,
        response_format: {
            type: "json_object"
        }
    });


    return response.choices[0].message.content;
}