import type { PoolConnection } from "mysql2/promise";
import { chunkText } from "./chunking.service";
import { createEmbeddings } from "./embedding.service";
import { saveChunksAndEmbeddings } from "../consultation/consultationChunks.repository";

export interface ConsultationIndex {
    chunks: string[];
    embeddings: number[][];
}

// calls the embedding api, so callers should run it outside any open transaction
export async function buildConsultationIndex(text: string): Promise<ConsultationIndex | null> {

    if (!text || text.trim() === "") return null;

    const chunks = await chunkText(text);
    const embeddings = await createEmbeddings(chunks);

    return { chunks, embeddings };
}

export async function saveConsultationIndex(
    patient_id: number,
    consultation_id: number,
    index: ConsultationIndex,
    connection?: PoolConnection
): Promise<void> {
    await saveChunksAndEmbeddings(patient_id, consultation_id, index.chunks, index.embeddings, connection);
}

export async function indexConsultation(patient_id: number, consultation_id: number, text: string): Promise<void> {

    const index = await buildConsultationIndex(text);

    if (index) {
        await saveConsultationIndex(patient_id, consultation_id, index);
    }
}
