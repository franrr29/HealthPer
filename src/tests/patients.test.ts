import request from "supertest";
import app from "../app";
import { conexionDB } from "../config/db";
import { createTestDoctor, deleteTestDoctors, TestDoctor } from "./helpers/auth.helper";

describe("Patients API", () => {

    let doctor: TestDoctor;
    let otherDoctor: TestDoctor;
    let patientId: number;
    let otherDoctorPatientId: number;

    beforeAll(async () => {
        doctor = await createTestDoctor(app, "patients");
        otherDoctor = await createTestDoctor(app, "patients.other");

        const patientRes = await otherDoctor.agent
            .post("/patients")
            .send({ name: "Paciente Doctor2" });

        otherDoctorPatientId = patientRes.body.patient.id;
    });

    afterAll(async () => {
        await deleteTestDoctors([doctor.id, otherDoctor.id]);
        await conexionDB.end();
    });

    test("creates a patient and returns the stored record", async () => {
        const res = await doctor.agent
            .post("/patients")
            .send({ name: "Paciente Test" });

        expect(res.status).toBe(201);
        expect(res.body.patient.name).toBe("Paciente Test");
        expect(res.body.patient.doctor_id).toBe(doctor.id);

        patientId = res.body.patient.id;
    });

    test("lists only the patients of the logged in doctor", async () => {
        const res = await doctor.agent.get("/patients");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.every((patient: { doctor_id: number }) => patient.doctor_id === doctor.id)).toBe(true);
    });

    test("gets a patient by id", async () => {
        const res = await doctor.agent.get(`/patients/${patientId}`);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(patientId);
    });

    test("updates a patient", async () => {
        const res = await doctor.agent
            .patch(`/patients/${patientId}`)
            .send({ name: "Paciente Actualizado" });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Patient information updated succesfully");
    });

    test("deletes a patient", async () => {
        const res = await doctor.agent.delete(`/patients/${patientId}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Patient information deleted");
    });

    test("401 rejects a request without cookies", async () => {
        const res = await request(app)
            .post("/patients")
            .set("X-Requested-With", "XMLHttpRequest")
            .send({ name: "No Token" });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    test("400 rejects invalid patient data", async () => {
        const res = await doctor.agent
            .post("/patients")
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test("404 prevents IDOR: a doctor cannot read another doctor patient", async () => {
        const res = await doctor.agent.get(`/patients/${otherDoctorPatientId}`);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ success: false, message: "Patient not found" });
    });

    test("does not let a doctor update or delete another doctor patient", async () => {
        const patchRes = await doctor.agent
            .patch(`/patients/${otherDoctorPatientId}`)
            .send({ name: "Hackeado" });

        const deleteRes = await doctor.agent.delete(`/patients/${otherDoctorPatientId}`);

        expect(patchRes.status).toBe(404);
        expect(deleteRes.status).toBe(404);

        const stillThere = await otherDoctor.agent.get(`/patients/${otherDoctorPatientId}`);

        expect(stillThere.body.data.name).toBe("Paciente Doctor2");
    });
});
