import { SUMMARY } from "./db.helper";

export const MEMORY = {
    chronic_diseases: ["Migrana"],
    allergies: [],
    medications: ["Ibuprofeno 400mg"],
    recurrent_symptoms: [],
    master_summary: "Paciente con migrana en tratamiento con ibuprofeno.",
};

export const mockChatCreate = jest.fn();
export const mockTranscribe = jest.fn();
export const mockCreateEmbeddings = jest.fn();

const reply = (content: unknown) => ({ choices: [{ message: { content: JSON.stringify(content) } }] });

const isMemoryRequest = (body: { messages: { content: string }[] }) =>
    body.messages.some((message) => message.content.includes("persistent medical memory"));

// used from jest.mock factories, which are hoisted above the imports of the test file
export function createOpenAIMock() {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => ({
            chat: { completions: { create: mockChatCreate } },
            audio: { transcriptions: { create: mockTranscribe } },
        })),
        toFile: async (data: Buffer, name: string, options?: { type?: string }) => ({ data, name, type: options?.type }),
    };
}

export function createEmbeddingServiceMock() {
    return { createEmbeddings: mockCreateEmbeddings };
}

export function resetAiMocks(): void {

    mockChatCreate.mockReset().mockImplementation(async (body) => reply(isMemoryRequest(body) ? MEMORY : SUMMARY));
    mockTranscribe.mockReset().mockResolvedValue({ text: "texto transcripto" });
    mockCreateEmbeddings.mockReset().mockImplementation(async (chunks: string[]) => chunks.map(() => [0.1, 0.2, 0.3]));
}
