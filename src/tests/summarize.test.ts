import request from "supertest";
import app from "../app";
import { conexionDB } from "../config/db";
import { createTestDoctor, deleteTestDoctors, TestDoctor } from "./helpers/auth.helper";
import { getConsultationRow, insertConsultation, insertPatient } from "./helpers/db.helper";
import { mockChatCreate, resetAiMocks } from "./helpers/aiMocks";

jest.mock("openai", () => require("./helpers/aiMocks").createOpenAIMock());
jest.mock("../modules/ai/embedding.service", () => require("./helpers/aiMocks").createEmbeddingServiceMock());

describe("POST /consultations/:id/summarize", () => {

    let doctor: TestDoctor;
    let otherDoctor: TestDoctor;
    let patientId: number;
    let consultationWithTranscript: number;
    let consultationWithoutTranscript: number;
    let consultationOtherDoctor: number;

    beforeAll(async () => {
        doctor = await createTestDoctor(app, "summarize");
        otherDoctor = await createTestDoctor(app, "summarize.other");

        patientId = await insertPatient(doctor.id, "Paciente Summarize Test");
        consultationWithTranscript = await insertConsultation({ patientId, doctorId: doctor.id });
        consultationWithoutTranscript = await insertConsultation({ patientId, doctorId: doctor.id, transcript: null });

        const otherPatientId = await insertPatient(otherDoctor.id);
        consultationOtherDoctor = await insertConsultation({ patientId: otherPatientId, doctorId: otherDoctor.id });
    });

    afterAll(async () => {
        await deleteTestDoctors([doctor.id, otherDoctor.id]);
        await conexionDB.end();
    });

    beforeEach(() => {
        resetAiMocks();
    });

    test("200 generates the summary, stores it and moves the consultation to reviewed", async () => {
        const res = await doctor.agent.post(`/consultations/${consultationWithTranscript}/summarize`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Consultation summarized successfully");
        expect(res.body.data).toMatchObject({
            chief_complaint: expect.any(String),
            symptoms: expect.any(Array),
            diagnosis: expect.any(String),
            treatment: expect.any(String),
            follow_up: expect.any(String),
        });
        expect(mockChatCreate).toHaveBeenCalledTimes(1);

        const row = await getConsultationRow(consultationWithTranscript);

        expect(row.status).toBe("reviewed");
        expect(row.ai_summary).not.toBeNull();
    });

    test("401 rejects a request without cookies", async () => {
        const res = await request(app).post(`/consultations/${consultationWithTranscript}/summarize`).set("X-Requested-With", "XMLHttpRequest");

        expect(res.status).toBe(401);
    });

    test("404 cannot summarize a consultation of another doctor", async () => {
        const res = await doctor.agent.post(`/consultations/${consultationOtherDoctor}/summarize`);

        expect(res.status).toBe(404);
        expect(mockChatCreate).not.toHaveBeenCalled();
    });

    test("404 when the consultation does not exist", async () => {
        const res = await doctor.agent.post("/consultations/999999999/summarize");

        expect(res.status).toBe(404);
    });

    test("400 when the consultation has no transcript, before calling the llm", async () => {
        const res = await doctor.agent.post(`/consultations/${consultationWithoutTranscript}/summarize`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ success: false, message: "Transcript is required for summarization" });
        expect(mockChatCreate).not.toHaveBeenCalled();
    });

    test("502 when the llm is down", async () => {
        mockChatCreate.mockRejectedValue(Object.assign(new Error("bad request"), { status: 400 }));

        const res = await doctor.agent.post(`/consultations/${consultationWithTranscript}/summarize`);

        expect(res.status).toBe(502);
        expect(res.body.success).toBe(false);
    });
});
