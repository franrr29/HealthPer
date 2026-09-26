import { MEMORY_SYSTEM_PROMPT, buildMemoryPrompt } from "./memory.prompt";
import * as memoryRepository from "./memory.repository";
import { patientMemorySchema, PatientMemory } from "../../schemas/schema.patientMemory";
import { ConsultationSummary } from "../../schemas/schema.llmAnswer";
import { parseJsonArray } from "../../utils/json";
import { getLLMProvider } from "./llm.factory";
import type { PoolConnection } from "mysql2/promise";
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

// calls the llm, so callers should run it outside any open transaction
export async function buildUpdatedPatientMemory(
    patient_id: number,
    new_summary: ConsultationSummary
): Promise<PatientMemory> {

    const existingRow = await memoryRepository.getByPatientId(patient_id);
    const currentMemory = existingRow ? toPatientMemory(existingRow) : null;

    const userPrompt = buildMemoryPrompt(currentMemory, new_summary);

    return getLLMProvider().generateJSON(userPrompt, MEMORY_SYSTEM_PROMPT, patientMemorySchema);
}

export async function savePatientMemory(
    patient_id: number,
    memory: PatientMemory,
    connection?: PoolConnection
): Promise<void> {

    const existingRow = await memoryRepository.getByPatientId(patient_id, connection);
    const memoryData = toUpsertDTO(memory);

    if (existingRow) {
        await memoryRepository.update(patient_id, memoryData, connection);
    } else {
        await memoryRepository.create(patient_id, memoryData, connection);
    }
}
