import { MEMORY_SYSTEM_PROMPT, buildMemoryPrompt } from "./memory.prompt";
import * as memoryRepository from "./memory.repository";
import { patientMemorySchema, PatientMemory } from "../../schemas/schema.patientMemory";
import { ConsultationSummary } from "../../schemas/schema.llmAnswer";
import { parseJsonArray } from "../../utils/json";
import { getLLMProvider } from "./llm.factory";
import type { PatientMemoryRow, UpsertPatientMemoryDTO } from "../../types/patientMemory.types";

function toPatientMemory(row: PatientMemoryRow): PatientMemory {
    return {
        chronic_diseases: parseJsonArray(row.chronic_diseases) ?? [],
        allergies: parseJsonArray(row.allergies) ?? [],
        medications: parseJsonArray(row.medications) ?? [],
        recurrent_symptoms: parseJsonArray(row.recurrent_symptoms) ?? [],
        master_summary: row.master_summary ?? ""
    };
}

function toUpsertDTO(memory: PatientMemory): UpsertPatientMemoryDTO {
    return {
        chronic_diseases: JSON.stringify(memory.chronic_diseases),
        allergies: JSON.stringify(memory.allergies),
        medications: JSON.stringify(memory.medications),
        recurrent_symptoms: JSON.stringify(memory.recurrent_symptoms),
        master_summary: memory.master_summary
    };
}

export async function updatePatientMemoryService(
    patient_id: number,
    new_summary: ConsultationSummary
): Promise<PatientMemory> {

    const existingRow = await memoryRepository.getByPatientId(patient_id);
    const currentMemory = existingRow ? toPatientMemory(existingRow) : null;

    const userPrompt = buildMemoryPrompt(currentMemory, new_summary);

    const newMemory = await getLLMProvider().generateJSON(userPrompt, MEMORY_SYSTEM_PROMPT, patientMemorySchema);
    const memoryData = toUpsertDTO(newMemory);

    if (existingRow) {
        await memoryRepository.update(patient_id, memoryData);
    } else {
        await memoryRepository.create(patient_id, memoryData);
    }

    return newMemory;
}
