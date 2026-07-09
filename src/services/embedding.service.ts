import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";

const ai = new GoogleGenAI({ 
    apiKey: env.GEMINI_API_KEY,
    httpOptions: { apiVersion: "v1" }
});

//funcion que recibe chunks y devuelve un array de embeddings, 
// se usa para indexar las consultas en la base de datos y poder hacer busquedas semanticas

export async function createEmbeddings(chunks: string[]): Promise<number[][]> {
    
    const embeddings: number[][] = [];

    for (const chunk of chunks) {
       const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: chunk,
});

    if (!response.embeddings?.[0]?.values) {
        throw new Error("embedding response vacio para chunk");

}
    embeddings.push(response.embeddings[0].values);
    }

    return embeddings;
}