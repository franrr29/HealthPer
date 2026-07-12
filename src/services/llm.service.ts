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
export async function generateConsultationSummary(patient_id: number, transcript: string) {


    if (!transcript?.trim()) {
        throw new Error("Transcript is required");
    }


    //genera el resumen con la info de la consulta y envia parametros a la funcion del prompt.services
    const prompt = await buildSummaryPrompt(patient_id, transcript);


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




//enviar el prompt al llm y traer la respuesta en textp plano
export async function generateTextAnswer(prompt:string): Promise<string> {

    if(!prompt?.trim()) {

        throw new Error("Prompt is required");
    }

    const messagesLLM = [
        {
            role: "user" as const,
            content: prompt
        }
    ];

    //llamo al llm
    const response = await groqLLM.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: messagesLLM
    });

    const raw = response.choices[0].message.content

    if (!raw) {
        throw new Error("LLM returned empty response");
    }

    return raw.trim();
}