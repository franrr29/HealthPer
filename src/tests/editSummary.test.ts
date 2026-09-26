import request from "supertest";
import app from "../app";
import { conexionDB } from "../config/db";
import { createTestDoctor, deleteTestDoctors, TestDoctor } from "./helpers/auth.helper";
import { getConsultationRow, insertConsultation, insertPatient } from "./helpers/db.helper";

describe("PATCH /consultations/:id", () => {

    let doctor: TestDoctor;
    let otherDoctor: TestDoctor;
    let consultationId: number;
    let consultationOtherDoctor: number;

    beforeAll(async () => {
        doctor = await createTestDoctor(app, "editsummary");
        otherDoctor = await createTestDoctor(app, "editsummary.other");

        const patientId = await insertPatient(doctor.id);
        consultationId = await insertConsultation({ patientId, doctorId: doctor.id, status: "reviewed" });

        const otherPatientId = await insertPatient(otherDoctor.id);
        consultationOtherDoctor = await insertConsultation({ patientId: otherPatientId, doctorId: otherDoctor.id, status: "reviewed" });
    });

    afterAll(async () => {
        await deleteTestDoctors([doctor.id, otherDoctor.id]);
        await conexionDB.end();
    });

    test("401 rejects a request without cookies", async () => {
        const res = await request(app)
            .patch(`/consultations/${consultationId}`)
            .send({ edited_summary: "nuevo resumen" });

        expect(res.status).toBe(401);
    });

    test("400 rejects an empty body", async () => {
        const res = await doctor.agent
            .patch(`/consultations/${consultationId}`)
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain("At least one field is required");
    });

    test("404 cannot edit a consultation of another doctor", async () => {
        const res = await doctor.agent
            .patch(`/consultations/${consultationOtherDoctor}`)
            .send({ edited_summary: JSON.stringify({ text: "intento de edicion ajena" }) });

        expect(res.status).toBe(404);
    });

    test("200 edits the summary of an own consultation", async () => {
        const res = await doctor.agent
            .patch(`/consultations/${consultationId}`)
            .send({ edited_summary: JSON.stringify({ text: "resumen editado por el doctor" }) });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Patient information updated succesfully");
        expect((await getConsultationRow(consultationId)).edited_summary).toEqual({ text: "resumen editado por el doctor" });
    });
});
