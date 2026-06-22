//Testear todo el trancript de la ia mas firma del doctor a signed: import request from "supertest";
import app from "../../app";
import { conexionDB } from "../config/db";
import OpenAI from "openai";
import request from "supertest";

// mock del llm para no gastar tokens reales ni depender de groq en ci
jest.mock("openai", () => {
    const mockCreate = jest.fn().mockResolvedValue({
        choices: [{
            message: {
                content: JSON.stringify({
                    chief_complaint: "Dolor de cabeza",
                    symptoms: ["cefalea", "mareos"],
                    diagnosis: "Tension headache",
                    treatment: "Ibuprofeno 400mg",
                    follow_up: "Control en 1 semana"
                })
            }
        }]
    });

    return jest.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: mockCreate
            }
        }
    }));
});

// guardo referencia al mock para poder limpiarlo entre tests
const mockCreate = (new (OpenAI as any)()).chat.completions.create;

let doctorToken: string;
let TEST_DOCTOR_ID: number;
let TEST_PATIENT_ID: number;
let consultationWithTranscript: number;
let consultationWithoutTranscript: number;
let consultationOtherDoctor: number;

beforeAll(async () => {

    // email unico para no chocar con otros tests
    const testEmail = "doctor.summarize." + Date.now() + "@test.com";

    // registro el doctor principal de estos tests
    const registerRes = await request(app)
        .post("/auth/register")
        .send({
            name: "Doctor Summarize Test",
            email: testEmail,
            password: "password123"
        });

    TEST_DOCTOR_ID = registerRes.body.data.insertId;

    // hago login y guardo el token para los requests
    const loginRes = await request(app)
        .post("/auth/login")
        .send({ email: testEmail, password: "password123" });

    doctorToken = loginRes.body.data.token;

    // creo el paciente que voy a usar en las consultas
    const patientRes = await request(app)
        .post("/patients")
        .set("Authorization", "Bearer " + doctorToken)
        .send({ name: "Paciente Summarize Test" });

    TEST_PATIENT_ID = patientRes.body.patient.id;

    // consulta lista para resumir, tiene transcript valido
    const insertOk: any = await conexionDB.query(
        "INSERT INTO consultations (patient_id, doctor_id, transcript, status) VALUES (?, ?, ?, 'draft')",
        [TEST_PATIENT_ID, TEST_DOCTOR_ID, "El paciente refiere dolor de cabeza intenso desde hace 3 dias"]
    );

    consultationWithTranscript = insertOk[0].insertId;

    // consulta sin transcript, el service debe rechazarla
    const insertNoTranscript: any = await conexionDB.query(
        "INSERT INTO consultations (patient_id, doctor_id, transcript, status) VALUES (?, ?, NULL, 'draft')",
        [TEST_PATIENT_ID, TEST_DOCTOR_ID]
    );

    consultationWithoutTranscript = insertNoTranscript[0].insertId;

    // creo un segundo doctor para probar que no puede ver consultas ajenas
    const otherEmail = "doctor.other." + Date.now() + "@test.com";

    const otherRegister = await request(app)
        .post("/auth/register")
        .send({
            name: "Doctor Other",
            email: otherEmail,
            password: "password123"
        });

    const OTHER_DOCTOR_ID = otherRegister.body.data.insertId;

    // consulta que pertenece al otro doctor, no al principal
    const insertOther: any = await conexionDB.query(
        "INSERT INTO consultations (patient_id, doctor_id, transcript, status) VALUES (?, ?, ?, 'draft')",
        [TEST_PATIENT_ID, OTHER_DOCTOR_ID, "transcript del otro doctor"]
    );

    consultationOtherDoctor = insertOther[0].insertId;
});

// limpio las llamadas al mock antes de cada test para no mezclar conteos
beforeEach(() => {
    mockCreate.mockClear();
});

describe("POST /consultations/:id/summarize", () => {

    // caso feliz: todo esta bien, el llm responde y guardamos el resumen
    it("200 genera el resumen de una consulta con transcript valido", async () => {

        const res = await request(app)
            .post("/consultations/" + consultationWithTranscript + "/summarize")
            .set("Authorization", "Bearer " + doctorToken);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Consultation summarized successfully");

        // verifico que data tiene la forma que devuelve el schema de zod
        expect(res.body.data).toMatchObject({
            chief_complaint: expect.any(String),
            symptoms: expect.any(Array),
            diagnosis: expect.any(String),
            treatment: expect.any(String),
            follow_up: expect.any(String)
        });

        // el mock debe haber sido llamado exactamente una vez
        expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    // sin token no puede pasar, el middleware de auth lo para
    it("401 rechaza el request si no hay token", async () => {

        const res = await request(app)
            .post("/consultations/" + consultationWithTranscript + "/summarize");

        expect(res.status).toBe(401);
    });

    // consulta de otro doctor, idor protection via doctor_id en la query
    it("404 no puede resumir una consulta que pertenece a otro doctor", async () => {

        const res = await request(app)
            .post("/consultations/" + consultationOtherDoctor + "/summarize")
            .set("Authorization", "Bearer " + doctorToken);

        expect(res.status).toBe(404);
    });

    // consulta inexistente, getConsultationByIdService retorna null
    it("404 no encuentra una consulta que no existe", async () => {

        const res = await request(app)
            .post("/consultations/999999999/summarize")
            .set("Authorization", "Bearer " + doctorToken);

        expect(res.status).toBe(404);
    });

    // sin transcript el service lanza error antes de llamar al llm
    it("500 falla si la consulta no tiene transcript", async () => {

        const res = await request(app)
            .post("/consultations/" + consultationWithoutTranscript + "/summarize")
            .set("Authorization", "Bearer " + doctorToken);

        expect(res.status).toBe(500);

        // el mock no debe haber sido llamado, fallo antes de llegar al llm
        expect(mockCreate).not.toHaveBeenCalled();
    });
});