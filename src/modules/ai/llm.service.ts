import OpenAI from "openai";
import { env } from "../../config/env";
import { SUMMARY_SYSTEM_PROMPT, buildSummaryPrompt } from "./prompt.service";
import { consultationSummarySchema } from "../../schemas/schema.llmAnswer";


// conexion con el LLM
const groqLLM = new OpenAI({
    apiKey: env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
    timeout: 30 * 1000
});

// generar resumen con el LLM
export async function generateConsultationSummary(patient_id: number, transcript: string) {

    if (!transcript?.trim()) {
        throw new Error("Transcript is required");
    }

    const prompt = await buildSummaryPrompt(patient_id, transcript);

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
        model: "openai/gpt-oss-120b",
        messages: messagesLLM,
        response_format: {
            type: "json_object"
        }
    });

    const raw = response.choices[0].message.content;

    if (!raw) {
        throw new Error("LLM returned empty response");
    }

    const parsed = JSON.parse(raw);
    return consultationSummarySchema.parse(parsed);
}


// enviar prompt al llm con system prompt opcional
export async function generateTextAnswer(prompt: string, systemPrompt?: string): Promise<string> {

    if (!prompt?.trim()) {
        throw new Error("Prompt is required");
    }

    const messagesLLM: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (systemPrompt?.trim()) {
        messagesLLM.push({ role: "system", content: systemPrompt });
    }

    messagesLLM.push({ role: "user", content: prompt });

    const response = await groqLLM.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: messagesLLM
    });

    const raw = response.choices[0].message.content;

    if (!raw) {
        throw new Error("LLM returned empty response");
    }

    return raw.trim();
}