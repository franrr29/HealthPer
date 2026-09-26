import request from "supertest";
import app from "../app";
import { conexionDB } from "../config/db";
import { createTestDoctor, deleteTestDoctors, TestDoctor } from "./helpers/auth.helper";
import { insertConsultation, insertPatient } from "./helpers/db.helper";

// every error must look like { success: false, message } and nothing else
describe("error response format", () => {

    let doctor: TestDoctor;
    let unsignedConsultationId: number;

    beforeAll(async () => {
        doctor = await createTestDoctor(app, "errorformat");

        const patientId = await insertPatient(doctor.id);
        unsignedConsultationId = await insertConsultation({ patientId, doctorId: doctor.id, status: "reviewed" });
    });

    afterAll(async () => {
        await deleteTestDoctors([doctor.id]);
        await conexionDB.end();
    });

    const cases: [string, number, () => Promise<request.Response>][] = [
        ["unknown route", 404, () => request(app).get("/route-that-does-not-exist")],
        ["missing access token", 401, () => request(app).get("/patients")],
        ["invalid access token", 401, () => request(app).get("/patients").set("Cookie", ["accessToken=invalid"])],
        ["invalid refresh token", 401, () => request(app).post("/auth/refresh").set("Cookie", ["refreshToken=invalid"])],
        ["wrong credentials", 401, () => request(app).post("/auth/login").send({ email: "nadie@test.com", password: "123456" })],
        ["zod validation on register", 400, () => request(app).post("/auth/register").send({ name: "" })],
        ["zod validation on patient", 400, () => doctor.agent.post("/patients").send({})],
        ["zod validation on consultation status", 400, () => doctor.agent.patch(`/consultations/${unsignedConsultationId}`).send({ status: "signed" })],
        ["patient not found", 404, () => doctor.agent.get("/patients/999999999")],
        ["consultation not found", 404, () => doctor.agent.get("/consultations/999999999")],
        ["email preview of a missing consultation", 404, () => doctor.agent.post("/consultations/999999999/email-content")],
        ["email preview of an unsigned consultation", 400, () => doctor.agent.post(`/consultations/${unsignedConsultationId}/email-content`)],
        ["email without recipient", 400, () => doctor.agent.post(`/consultations/${unsignedConsultationId}/send-email`).send({ emailContent: "hola" })],
        ["email without content", 400, () => doctor.agent.post(`/consultations/${unsignedConsultationId}/send-email`).send({ patientEmail: "p@test.com" })],
        ["ask without a question", 400, () => doctor.agent.post("/patients/1/ask").send({})],
        ["suggested questions without a transcript", 400, () => doctor.agent.post("/consultations/suggest-questions").send({})],
        ["transcribe without a file", 400, () => doctor.agent.post(`/consultations/${unsignedConsultationId}/transcribe`)],
    ];

    test.each(cases)("%s -> %i", async (_label, status, send) => {
        const res = await send();

        expect(res.status).toBe(status);
        expect(res.body.success).toBe(false);
        expect(typeof res.body.message).toBe("string");
        expect(Object.keys(res.body).sort()).toEqual(["message", "success"]);
    });

    test("duplicate registration -> 409", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ name: "Duplicado", email: doctor.email, password: doctor.password });

        expect(res.status).toBe(409);
        expect(Object.keys(res.body).sort()).toEqual(["message", "success"]);
    });
});
