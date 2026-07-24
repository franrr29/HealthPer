// testear PATCH /consultations/:id edicion del resumen por el doctor

import request from "supertest";
import app from "../app";
import { conexionDB } from "../config/db";

let doctorToken: string;
let TEST_DOCTOR_ID: number;
let TEST_PATIENT_ID: number;
let consultationId: number;
let consultationOtherDoctor: number;

beforeAll(async () => {

    const testEmail = "doctor.editsummary." + Date.now() + "@test.com";

    const registerRes = await request(app)
        .post("/auth/register")
        .send({
            name: "Doctor EditSummary Test",
            email: testEmail,
            password: "password123"
        });

    TEST_DOCTOR_ID = registerRes.body.data.insertId;

    const loginRes = await request(app)
        .post("/auth/login")
        .send({ email: testEmail, password: "password123" });

    doctorToken = loginRes.body.data.token;

    const patientRes = await request(app)
        .post("/patients")
        .set("Authorization", "Bearer " + doctorToken)
        .send({ name: "Paciente EditSummary Test" });

    TEST_PATIENT_ID = patientRes.body.patient.id;

    // consulta propia del doctor principal
    const insertOk: any = await conexionDB.query(
        "INSERT INTO consultations (patient_id, doctor_id, status) VALUES (?, ?, 'reviewed')",
        [TEST_PATIENT_ID, TEST_DOCTOR_ID]
    );

    consultationId = insertOk[0].insertId;

    // segundo doctor para probar idor
    const otherEmail = "doctor.editsummary.other." + Date.now() + "@test.com";

    const otherRegister = await request(app)
        .post("/auth/register")
        .send({
            name: "Doctor Other EditSummary",
            email: otherEmail,
            password: "password123"
        });

    const OTHER_DOCTOR_ID = otherRegister.body.data.insertId;

    // consulta que pertenece al otro doctor
    const insertOther: any = await conexionDB.query(
        "INSERT INTO consultations (patient_id, doctor_id, status) VALUES (?, ?, 'reviewed')",
        [TEST_PATIENT_ID, OTHER_DOCTOR_ID]
    );

    consultationOtherDoctor = insertOther[0].insertId;
});

describe("PATCH /consultations/:id", () => {

    // sin token el middleware para el request
    it("401 rechaza si no hay token", async () => {

        const res = await request(app)
            .patch("/consultations/" + consultationId)
            .send({ edited_summary: "nuevo resumen" });

        expect(res.status).toBe(401);
    });

    // body vacio, el controller lo rechaza
    it("400 rechaza si el body esta vacio", async () => {

        const res = await request(app)
            .patch("/consultations/" + consultationId)
            .set("Authorization", "Bearer " + doctorToken)
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Validation error");
    });

    // consulta de otro doctor, idor via AND doctor_id = ? en el update
    it("404 no puede editar una consulta de otro doctor", async () => {

        const res = await request(app)
            .patch("/consultations/" + consultationOtherDoctor)
            .set("Authorization", "Bearer " + doctorToken)
            .send({ edited_summary: "intento de edicion ajena" });

        expect(res.status).toBe(404);
    });

    // caso feliz
    it("200 edita el resumen de una consulta propia", async () => {

        const res = await request(app)
            .patch("/consultations/" + consultationId)
            .set("Authorization", "Bearer " + doctorToken)
            .send({ edited_summary: JSON.stringify({ text: "resumen editado por el doctor" }) });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Patient information updated succesfully");
    });
});
