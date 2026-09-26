import request from "supertest";
import app from "../app";
import { conexionDB } from "../config/db";
import { createTestDoctor, deleteTestDoctors, TestDoctor } from "./helpers/auth.helper";
import { EDITED_SUMMARY, SUMMARY, getConsultationRow, insertConsultation, insertPatient } from "./helpers/db.helper";
import { mockChatCreate, mockCreateEmbeddings, mockTranscribe, resetAiMocks } from "./helpers/aiMocks";

jest.mock("openai", () => require("./helpers/aiMocks").createOpenAIMock());
jest.mock("../modules/ai/embedding.service", () => require("./helpers/aiMocks").createEmbeddingServiceMock());

const SIGNED_TRANSCRIPT = "Transcript original de una consulta ya firmada";

const audioFile = { filename: "audio.webm", contentType: "audio/webm" };

describe("signed consultations are immutable", () => {

    let doctor: TestDoctor;
    let otherDoctor: TestDoctor;
    let patientId: number;
    let signedId: number;
    let reviewedId: number;
    let otherDoctorId: number;

    beforeAll(async () => {
        doctor = await createTestDoctor(app, "immutable");
        otherDoctor = await createTestDoctor(app, "immutable.other");

        patientId = await insertPatient(doctor.id);
        signedId = await insertConsultation({
            patientId,
            doctorId: doctor.id,
            status: "signed",
            transcript: SIGNED_TRANSCRIPT,
            aiSummary: SUMMARY,
            editedSummary: EDITED_SUMMARY,
        });
        reviewedId = await insertConsultation({ patientId, doctorId: doctor.id, status: "reviewed", aiSummary: SUMMARY });

        const otherPatientId = await insertPatient(otherDoctor.id);
        otherDoctorId = await insertConsultation({ patientId: otherPatientId, doctorId: otherDoctor.id, status: "reviewed" });
    });

    afterAll(async () => {
        await deleteTestDoctors([doctor.id, otherDoctor.id]);
        await conexionDB.end();
    });

    beforeEach(() => {
        resetAiMocks();
    });

    describe("PATCH /consultations/:id", () => {

        test("400 rejects status signed: only the sign flow can set it", async () => {
            const res = await doctor.agent
                .patch(`/consultations/${reviewedId}`)
                .send({ status: "signed" });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain("status");
            expect((await getConsultationRow(reviewedId)).status).toBe("reviewed");
        });

        test("409 cannot modify the transcript of a signed consultation", async () => {
            const res = await doctor.agent
                .patch(`/consultations/${signedId}`)
                .send({ transcript: "transcript alterado" });

            expect(res.status).toBe(409);
            expect(res.body).toEqual({ success: false, message: "Cannot modify a signed consultation" });
            expect((await getConsultationRow(signedId)).transcript).toBe(SIGNED_TRANSCRIPT);
        });

        test("409 cannot move a signed consultation back to draft", async () => {
            const res = await doctor.agent
                .patch(`/consultations/${signedId}`)
                .send({ status: "draft" });

            expect(res.status).toBe(409);
            expect((await getConsultationRow(signedId)).status).toBe("signed");
        });

        test("200 still allows editing a consultation that is not signed", async () => {
            const res = await doctor.agent
                .patch(`/consultations/${reviewedId}`)
                .send({ status: "draft" });

            expect(res.status).toBe(200);
            expect((await getConsultationRow(reviewedId)).status).toBe("draft");
        });
    });

    describe("POST /consultations/:id/summarize", () => {

        test("409 cannot re-summarize a signed consultation and never calls the llm", async () => {
            const res = await doctor.agent.post(`/consultations/${signedId}/summarize`);

            expect(res.status).toBe(409);
            expect(res.body).toEqual({ success: false, message: "Cannot re-summarize a signed consultation" });
            expect(mockChatCreate).not.toHaveBeenCalled();

            const row = await getConsultationRow(signedId);

            expect(row.status).toBe("signed");
            expect(row.ai_summary).toEqual(SUMMARY);
        });
    });

    describe("PATCH /consultations/:id/summary", () => {

        test("409 cannot edit the summary of a signed consultation", async () => {
            const res = await doctor.agent
                .patch(`/consultations/${signedId}/summary`)
                .send({ edited_summary: JSON.stringify({ diagnosis: "alterado" }) });

            expect(res.status).toBe(409);
            expect(res.body).toEqual({ success: false, message: "Cannot edit a signed consultation summary" });
            expect((await getConsultationRow(signedId)).edited_summary).toEqual(EDITED_SUMMARY);
        });
    });

    describe("POST /consultations/:id/transcribe", () => {

        test("409 cannot transcribe into a signed consultation and never spends whisper quota", async () => {
            const res = await doctor.agent
                .post(`/consultations/${signedId}/transcribe`)
                .attach("audio", Buffer.from("audio"), audioFile);

            expect(res.status).toBe(409);
            expect(res.body).toEqual({ success: false, message: "Cannot transcribe into a signed consultation" });
            expect(mockTranscribe).not.toHaveBeenCalled();
            expect((await getConsultationRow(signedId)).transcript).toBe(SIGNED_TRANSCRIPT);
        });

        test("404 does not call whisper for a consultation of another doctor", async () => {
            const res = await doctor.agent
                .post(`/consultations/${otherDoctorId}/transcribe`)
                .attach("audio", Buffer.from("audio"), audioFile);

            expect(res.status).toBe(404);
            expect(mockTranscribe).not.toHaveBeenCalled();
        });

        test("200 transcribes and appends to a consultation that is not signed", async () => {
            const consultationId = await insertConsultation({ patientId, doctorId: doctor.id, transcript: "Inicio." });

            const res = await doctor.agent
                .post(`/consultations/${consultationId}/transcribe`)
                .attach("audio", Buffer.from("audio"), audioFile);

            expect(res.status).toBe(200);
            expect(res.body.transcription).toBe("texto transcripto");
            expect(mockTranscribe).toHaveBeenCalledTimes(1);
            expect(mockTranscribe.mock.calls[0][0].file.type).toBe("audio/webm");
            expect((await getConsultationRow(consultationId)).transcript).toBe("Inicio. texto transcripto");
        });
    });

    describe("POST /consultations/:id/sign", () => {

        test("409 cannot sign a consultation that is already signed", async () => {
            const res = await doctor.agent.post(`/consultations/${signedId}/sign`);

            expect(res.status).toBe(409);
            expect(res.body).toEqual({ success: false, message: "Consultation is already signed" });
            expect(mockChatCreate).not.toHaveBeenCalled();
            expect(mockCreateEmbeddings).not.toHaveBeenCalled();
        });

        test("409 a second sign of the same consultation is rejected", async () => {
            const patientForSigning = await insertPatient(doctor.id);
            const consultationId = await insertConsultation({ patientId: patientForSigning, doctorId: doctor.id, status: "reviewed", aiSummary: SUMMARY });

            const first = await doctor.agent.post(`/consultations/${consultationId}/sign`);
            const second = await doctor.agent.post(`/consultations/${consultationId}/sign`);

            expect(first.status).toBe(200);
            expect(second.status).toBe(409);
        });
    });

    test("401 rejects these routes without cookies", async () => {
        const res = await request(app).patch(`/consultations/${signedId}`).send({ transcript: "x" });

        expect(res.status).toBe(401);
    });
});
