import request from "supertest";
import app from "../../app";
import { conexionDB } from "../config/db";
import { getAuthToken } from "./helpers/auth.helper";

describe("Patients API", () => {

    let token: string;
    let doctor2Token: string;
    let doctor2PatientId: number;

    beforeAll(async () => {

        // Limpiar doctor de test principal y el segundo doctor
        await conexionDB.execute(
            "DELETE FROM doctors WHERE email = ?",
            ["doctor@test.com"]
        );

        await conexionDB.execute(
            "DELETE FROM doctors WHERE email = ?",
            ["doctor2@test.com"]
        );

        // Registrar y loguear doctor principal
        await request(app)
            .post("/auth/register")
            .send({
                name: "Doctor Test",
                email: "doctor@test.com",
                password: "123456"
            });

        token = await getAuthToken(app);

        // Registrar y loguear segundo doctor para tests de IDOR
        await request(app)
            .post("/auth/register")
            .send({
                name: "Doctor Test 2",
                email: "doctor2@test.com",
                password: "123456"
            });

        const loginDoctor2 = await request(app)
            .post("/auth/login")
            .send({
                email: "doctor2@test.com",
                password: "123456"
            });

        doctor2Token = loginDoctor2.body.data.token;

        // Crear un paciente perteneciente al doctor2
        const patientRes = await request(app)
            .post("/patients")
            .set("Authorization", `Bearer ${doctor2Token}`)
            .send({ name: "Paciente de Doctor2" });

        doctor2PatientId = patientRes.body.patient.id;

    });

    afterAll(async () => {
        await conexionDB.end();
    });

    test("Must create a patient", async () => {

        const res = await request(app)
            .post("/patients")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Paciente Test"
            });

        expect(res.status)
            .toBe(201);

        expect(res.body.patient.name)
            .toBe("Paciente Test");

    });

});