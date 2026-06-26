import { createEmbeddings } from "./embedding.service";
import {
  getChunksByPatient,
  getChunksByFulltext
} from "../repositories/consultationChunks.repositories";

// funcion que calcula la similitud coseno entre dos embeddings
function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));

  return dot / (magA * magB);
}

//recupera los chunks mas relevantes de un paciente
export async function retrieveRelevantChunks(
  patient_id: number,
  queryText: string,
  topK: number
): Promise<{ chunk_index: number; text: string }[]> {

  
  const embeddings = await createEmbeddings([queryText]);
  const queryEmbedding = embeddings[0];

  
  const chunks = await getChunksByPatient(patient_id);

  // calcula el score de similitud para cada chunk
  const scoredChunks = chunks.map(chunk => ({
    ...chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding)
  }));

  // ordena los chunks por similitud coseno
  const rankedByCosine = scoredChunks
    .sort((a, b) => b.score - a.score)
    .map(chunk => chunk.id);

  // busca los chunks usando fulltext
  const fulltextChunks = await getChunksByFulltext(patient_id, queryText);

  const rankedByFulltext = fulltextChunks.map(chunk => chunk.id);

  // combina los dos rankings con rrf
  const K = 60;
  const rrfScores = new Map<number, number>();

  rankedByCosine.forEach((id, i) => {
    rrfScores.set(id, (rrfScores.get(id) ?? 0) + 1 / (K + i + 1));
  });

  rankedByFulltext.forEach((id, i) => {
    rrfScores.set(id, (rrfScores.get(id) ?? 0) + 1 / (K + i + 1));
  });

    // ordena los chunks por el score combinado
    const ordenarChunks = chunks
    .map(chunk => ({
      ...chunk,
      rrfScore: rrfScores.get(chunk.id) ?? 0
    }))
    .sort((a, b) => b.rrfScore - a.rrfScore)
    .slice(0, topK)
    .map(chunk => ({ chunk_index: chunk.chunk_index, text: chunk.text }));

    return ordenarChunks;
}