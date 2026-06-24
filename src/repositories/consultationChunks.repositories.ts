//Funcion que recibe los chunks y embedings y los guarda en la base de datos;
import { conexionDB } from "../config/db";



export async function saveChunksAndEmbeddings(patient_id: number, consultation_id: number,
     chunks: string [], embeddings: number[][]): Promise<void> {

        //index para identificar el orden de los chunks y embeddings
       const values= chunks.map ((chunk, index) => [
        patient_id, consultation_id, index, chunk, JSON.stringify(embeddings[index])
       ]);

       const sql= `INSERT INTO consultation_chunks
        (patient_id, consultation_id, chunk_index, text, embedding) VALUES ?`;

        await conexionDB.query(sql, [values]);
    

}


//Value y sql separados porque uno es un array de arrays y convierte embeddings a string porque sql no soporta arrays directo 
//Values dentro de la consulta pq se inserta todo de una vez y no uno por uno, es mas eficiente