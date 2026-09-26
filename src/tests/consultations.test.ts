import request from "supertest";
import app from "../app";
import { conexionDB } from "../config/db";
import * as chunksRepository from "../modules/consultation/consultationChunks.repository";
import { ExternalServiceError } from "../errors";
import { createTestDoctor, deleteTestDoctors, TestDoctor } from "./helpers/auth.helper";
import { EDITED_SUMMARY, SUMMARY, countRows, getConsultationRow, insertConsultation, insertPatient } from "./helpers/db.helper";
import { mockChatCreate, mockCreateEmbeddings, resetAiMocks } from "./helpers/aiMocks";

jest.mock("openai", () => require("./helpers/aiMocks").createOpenAIMock());
jest.mock("../modules/ai/embedding.service", () => require("./helpers/aiMocks").createEmbeddingServiceMock());

const memoryPrompt = () => {
    const memoryCall = mockChatCreate.mock.calls.find(([body]) =>
        body.messages.some((message: { content: string }) => message.content.includes("persistent medical memory")));

    return memoryCall?.[0].messages.find((message: { role: string }) => message.role === "user").content as string;
};

describe("POST /consultations/:id/sign", () => {

    let doctor: TestDoctor;
    let otherDoctor: TestDoctor;

    beforeAll(async () => {
        doctor = await createTestDoctor(app, "sign");
        otherDoctor = await createTestDoctor(app, "sign.other");
    });

    afterAll(async () => {
        await deleteTestDoctors([doctor.id, otherDoctor.id]);
        await conexionDB.end();
    });

    beforeEach(() => {
        resetAiMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // each test gets its own patient so memory and chunk counts never overlap
    const seedReviewedConsultation = async (extra: { editedSummary?: object } = {}) => {
        const patientId = await insertPatient(doctor.id);
        const consultationId = await insertConsultation({
            patientId,
            doctorId: doctor.id,
            status: "reviewed",
            aiSummary: SUMMARY,
            editedSummary: extra.editedSummary,
        });

        return { patientId, consultationId };
    };

    test("200 signs the consultation and saves the patient memory and the chunks", async () => {
        const { patientId, consultationId } = await seedReviewedConsultation();

        const res = await doctor.agent.post(`/consultations/${consultationId}/sign`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Consultation signed successfully");

        const row = await getConsultationRow(consultationId);

        expect(row.status).toBe("signed");
        expect(row.signed_at).not.toBeNull();
        expect(await countRows("patient_memory", "patient_id", patientId)).toBe(1);
        expect(await countRows("consultation_chunks", "consultation_id", consultationId)).toBeGreaterThan(0);
    });

    test("uses the ai summary for the memory when the doctor did not edit it", async () => {
        const { consultationId } = await seedReviewedConsultation();

        await doctor.agent.post(`/consultations/${consultationId}/sign`);

        expect(memoryPrompt()).toContain(SUMMARY.diagnosis);
    });

    test("uses the doctor's edited summary for the memory instead of the ai draft", async () => {
        const { consultationId } = await seedReviewedConsultation({ editedSummary: EDITED_SUMMARY });

        const res = await doctor.agent.post(`/consultations/${consultationId}/sign`);

        expect(res.status).toBe(200);
        expect(memoryPrompt()).toContain(EDITED_SUMMARY.diagnosis);
        expect(memoryPrompt()).not.toContain(SUMMARY.diagnosis);
    });

    test("rolls everything back when saving the chunks fails inside the transaction", async () => {
        const { patientId, consultationId } = await seedReviewedConsultation();

        jest.spyOn(chunksRepository, "saveChunksAndEmbeddings")
            .mockRejectedValueOnce(new Error("simulated database failure"));

        const res = await doctor.agent.post(`/consultations/${consultationId}/sign`);

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);

        const row = await getConsultationRow(consultationId);

        expect(row.status).toBe("reviewed");
        expect(row.signed_at).toBeNull();
        expect(await countRows("patient_memory", "patient_id", patientId)).toBe(0);
    });

    test("502 and stays unsigned when the embedding provider fails", async () => {
        const { patientId, consultationId } = await seedReviewedConsultation();

        mockCreateEmbeddings.mockRejectedValueOnce(new ExternalServiceError("Embedding provider down", "gemini"));

        const res = await doctor.agent.post(`/consultations/${consultationId}/sign`);

        expect(res.status).toBe(502);
        expect(res.body).toEqual({ success: false, message: "Embedding provider down" });

        const row = await getConsultationRow(consultationId);

        expect(row.status).toBe("reviewed");
        expect(await countRows("patient_memory", "patient_id", patientId)).toBe(0);
        expect(await countRows("consultation_chunks", "consultation_id", consultationId)).toBe(0);
    });

    test("502 and stays unsigned when the llm cannot update the memory", async () => {
        const { consultationId } = await seedReviewedConsultation();

        // a 400 is not retried, so both the primary and the fallback model fail immediately
        mockChatCreate.mockRejectedValue(Object.assign(new Error("bad request"), { status: 400 }));

        const res = await doctor.agent.post(`/consultations/${consultationId}/sign`);

        expect(res.status).toBe(502);

        const row = await getConsultationRow(consultationId);

        expect(row.status).toBe("reviewed");
        expect(row.signed_at).toBeNull();
    });

    test("409 does not sign a consultation that is already signed", async () => {
        const patientId = await insertPatient(doctor.id);
        const consultationId = await insertConsultation({ patientId, doctorId: doctor.id, status: "signed", aiSummary: SUMMARY });

        const res = await doctor.agent.post(`/consultations/${consultationId}/sign`);

        expect(res.status).toBe(409);
        expect(res.body).toEqual({ success: false, message: "Consultation is already signed" });
        expect(mockChatCreate).not.toHaveBeenCalled();
    });

    test("400 does not sign a consultation without a summary", async () => {
        const patientId = await insertPatient(doctor.id);
        const consultationId = await insertConsultation({ patientId, doctorId: doctor.id, status: "draft" });

        const res = await doctor.agent.post(`/consultations/${consultationId}/sign`);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test("404 when the consultation does not exist", async () => {
        const res = await doctor.agent.post("/consultations/999999999/sign");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ success: false, message: "Consultation not found" });
    });

    test("404 when the consultation belongs to another doctor", async () => {
        const patientId = await insertPatient(otherDoctor.id);
        const consultationId = await insertConsultation({ patientId, doctorId: otherDoctor.id, status: "reviewed", aiSummary: SUMMARY });

        const res = await doctor.agent.post(`/consultations/${consultationId}/sign`);

        expect(res.status).toBe(404);
        expect((await getConsultationRow(consultationId)).status).toBe("reviewed");
    });

    test("401 without cookies", async () => {
        const res = await request(app).post("/consultations/1/sign");

        expect(res.status).toBe(401);
    });
});
