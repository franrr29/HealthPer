//ChunkText, embedding y repositorioe separados pero aca coordino funciones para que se haga ordenado y orquesta todos

import { chunkText } from "./chunking.service";
import { createEmbeddings } from "./embedding.service";
import { saveChunksAndEmbeddings } from "../repositories/consultationChunks.repositories";


//Funcion que reciebe el texto de la consult, divide chunks, crea embeddings y guarda en la base de datos 

export async function indexConsultation(patient_id: number, consultation_id: number, text: string): Promise<void> {

    if (!text || text.trim() === "") return;

    const chunks = chunkText(text);

    const embeddings = await createEmbeddings(chunks);

    await saveChunksAndEmbeddings(patient_id, consultation_id, chunks, embeddings);



}