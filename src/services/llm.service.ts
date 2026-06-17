import OpenAI from "openai";
import { env } from "../config/env";
import { SUMMARY_SYSTEM_PROMPT, buildSummaryPrompt } from "./prompt.service";
import { consultationSummarySchema } from "../schemas/schema.llmAnswer";

//Crear conexion con el LLM:
const groqLLM= new OpenAI ({
    apiKey: env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1" 
});


// Generar resumen con el LLM:

export async function generateConsultationSummary(transcript: string) {


    if (!transcript?.trim()) {
        throw new Error("Transcript is required");
    }


    //genera el resumen con la info de la consulta
    const prompt = buildSummaryPrompt(transcript);


    //defino contexto y y peticion enviada al modelo
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


    //envio la solicitud y espero la respuesta del llm
    const response = await groqLLM.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: messagesLLM,
        response_format: {
            type: "json_object"
        }
    });

    
    //Validar datos qeu trajo el llm luego de traer su respuesta de response:

    const raw = response.choices[0].message.content

    if (!raw) {

    throw new Error("LLM returned empty response");

}

    const parsed = JSON.parse(raw)
    return consultationSummarySchema.parse(parsed)

}

