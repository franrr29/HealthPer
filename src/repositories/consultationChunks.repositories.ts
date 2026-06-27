import { conexionDB } from "../config/db";

// Guarda los chunks y sus embeddings en la base de datos.
export async function saveChunksAndEmbeddings(patient_id: number,consultation_id: number,
        chunks: string[],embeddings: number[][]
): Promise<void> {

        // Prepara los valores para el INSERT masivo.
  
        const values = chunks.map((chunk, index) => [
                patient_id,
                consultation_id,
                index,
                chunk,
                JSON.stringify(embeddings[index])]);
                
                
        const sql = `
         INSERT INTO consultation_chunks
         (patient_id, consultation_id, chunk_index, text, embedding)
         VALUES ?
         `;
         
         
         await conexionDB.query(sql, [values]);
}



// Obtiene todos los chunks y embeddings de un paciente.
export async function getChunksByPatient(
  patient_id: number
): Promise<{ id: number; chunk_index: number; text: string; embedding: number[] }[]> {

  const sqlQuery = `
    SELECT id, chunk_index, text, embedding
    FROM consultation_chunks
    WHERE patient_id = ?
  `;

  const [rows] = await conexionDB.query(sqlQuery, [patient_id]);

  // Convierte el embedding almacenado como json a un array de nmeros
  return (rows as any[]).map(row => ({
    id: row.id,
    chunk_index: row.chunk_index,
    text: row.text,
    embedding: JSON.parse(row.embedding)
  }));
}

// Busca los chunks mas relevantes utilizando fulltext search
export async function getChunksByFulltext(
  patient_id: number,
  queryText: string
): Promise<{ id: number; chunk_index: number; text: string; ft_score: number }[]> {
        
        
        const sqlQuery = `
         SELECT
            id,
            chunk_index,
            text,
            MATCH(text) AGAINST (? IN NATURAL LANGUAGE MODE) AS ft_score
          FROM consultation_chunks
          WHERE patient_id = ?
            AND MATCH(text) AGAINST (? IN NATURAL LANGUAGE MODE)
          ORDER BY ft_score DESC
          LIMIT 20
  `;

  const [rows] = await conexionDB.query(sqlQuery, [
    queryText,
    patient_id,
    queryText
  ]);

  return (rows as any[]).map(row => ({
    id: row.id,
    chunk_index: row.chunk_index,
    text: row.text,
    ft_score: row.ft_score
  }));
}