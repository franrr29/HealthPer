import { ValidationError } from "../../errors";
import { SUMMARY_SYSTEM_PROMPT, buildSummaryPrompt } from "./prompt.service";
import { consultationSummarySchema, ConsultationSummary } from "../../schemas/schema.llmAnswer";
import { getLLMProvider } from "./llm.factory";

export async function generateConsultationSummary(
    patient_id: number,
    transcript: string
): Promise<ConsultationSummary> {

    if (!transcript?.trim()) {
        throw new ValidationError("Transcript is required");
    }

    const prompt = await buildSummaryPrompt(patient_id, transcript);

    return getLLMProvider().generateJSON(prompt, SUMMARY_SYSTEM_PROMPT, consultationSummarySchema);
}

export async function generateTextAnswer(prompt: string, systemPrompt?: string): Promise<string> {

    if (!prompt?.trim()) {
        throw new ValidationError("Prompt is required");
    }

    return getLLMProvider().generateText(prompt, systemPrompt);
}
