//Aca creo los chunks y contexto de la historia clinica para el llm y los guardo en bd:

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});


//Funcion para crear los chunks de texto y guardarlos en la base de datos
export async function chunkText(text: string): Promise<string[]> {

    const chunks = await splitter.splitText(text);
    return chunks;
}