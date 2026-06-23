//Crear los embeddings de los chunks de texto y guardarlos en la base de datos

import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../env";



const genAI = new GoogleGenerativeAI(
  env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

//Funcion para crear los embeddings de los chunks de texto y guardarlos en la base de datos

export async function createEmbeddings(chunks: string[]): Promise<number[][]> {

    const embeddings: number[][] = [];

    for (const chunk of chunks) {

        const response= await model.embedContent (chunk);
        embeddings.push(response.embedding.values);
    
    }
    
    return embeddings;
}
