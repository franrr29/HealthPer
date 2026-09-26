import { getEmbeddingProvider } from "./llm.factory";

export async function createEmbeddings(chunks: string[]): Promise<number[][]> {
    return getEmbeddingProvider().embed(chunks);
}
