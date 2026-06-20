import request from "supertest";
import app from "../../app";
import { conexionDB } from "../config/db";
import OpenAI from "openai";


//mock del llm para no gastar tokens reales
jest.mock("openai", () => {
    const mockCreate = jest.fn().mockResolvedValue({
        choices: [{
            message: {
                content: JSON.stringify({
                    chronic_diseases: ["Hipotiroidismo"],
                    allergies: ["Polen"],
                    medications: ["Levotiroxina T4 50mcg"],
                    recurrent_symptoms: ["Dolor de cabeza y mareos"],
                    master_summary: "Paciente con hipotiroidismo en tratamiento con T4, alergico al polen, con episodios recurrentes de dolor de cabeza y mareos."
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


//obtengo el mock para limpiarlo en cada test
const mockCreate = (new (OpenAI as any)()).chat.completions.create;


//datos usados en los tests
let doctorToken: string;
let TEST_DOCTOR_ID: number;
let TEST_PATIENT_ID: number;
let consultationToSign: number;
let consultationAlreadySigned: number;
let consultationWithoutSummary: number;


beforeAll(async () => {

    //genero email unico para evitar repetidos
    const testEmail = "doctor.consultations." + Date.now() + "@test.com";


    //creo doctor para los tests
    const registerRes = await request(app)
        .post("/auth/register")
        .send({
            name: "Doctor Consultations Test",
            email: testEmail,
            password: "password123"
        });

    TEST_DOCTOR_ID = registerRes.body.data.insertId;


    //hago login y guardo token
    const loginRes = await request(app)
        .post("/auth/login")
        .send({ email: testEmail, password: "password123" });

    doctorToken = loginRes.body.data.token;


    //creo paciente de prueba
    const patientRes = await request(app)
        .post("/patients")
        .set("Authorization", "Bearer " + doctorToken)
        .send({
            name: "Paciente Test"
        });

    TEST_PATIENT_ID = patientRes.body.patient.id;


    //creo consulta lista para firmar
    const insertOk: any = await conexionDB.query(
        "INSERT INTO consultations (patient_id, doctor_id, transcript, ai_summary, status) VALUES (?, ?, ?, ?, ?)",
        [
            TEST_PATIENT_ID,
            TEST_DOCTOR_ID,
            "transcript de prueba",
            JSON.stringify({
                chief_complaint: "Control",
                symptoms: ["dolor de cabeza"],
                diagnosis: "Hipotiroidismo",
                treatment: "Levotiroxina 50mcg",
                follow_up: "Control en 1 mes"
            }),
            "reviewed"
        ]
    );

    consultationToSign = insertOk[0].insertId;


    //creo consulta ya firmada
    const insertSigned: any = await conexionDB.query(
        "INSERT INTO consultations (patient_id, doctor_id, transcript, ai_summary, status, signed_at) VALUES (?, ?, ?, ?, 'signed', NOW())",
        [
            TEST_PATIENT_ID,
            TEST_DOCTOR_ID,
            "transcript firmado",
            JSON.stringify({
                chief_complaint: "Control",
                symptoms: [],
                diagnosis: "N/A",
                treatment: "N/A",
                follow_up: "N/A"
            })
        ]
    );

    consultationAlreadySigned = insertSigned[0].insertId;


    //creo consulta sin resumen ia
    const insertNoSummary: any = await conexionDB.query(
        "INSERT INTO consultations (patient_id, doctor_id, transcript, ai_summary, status) VALUES (?, ?, ?, NULL, 'draft')",
        [
            TEST_PATIENT_ID,
            TEST_DOCTOR_ID,
            "transcript sin resumen"
        ]
    );

    consultationWithoutSummary = insertNoSummary[0].insertId;
});


//limpio llamadas anteriores del mock
beforeEach(() => {
    mockCreate.mockClear();
});


describe("POST /consultations/:id/sign", () => {


    it("200 firma una consulta valida y la deja en signed", async () => {

        //mando consulta valida para firmar
        const res = await request(app)
            .post("/consultations/" + consultationToSign + "/sign")
            .set("Authorization", "Bearer " + doctorToken);


        //verifico que se firmo correctamente
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("signed");
        expect(res.body.signed_at).toBeDefined();
    });


    it("409 no deja firmar una consulta que ya esta firmada", async () => {

        //intento firmar consulta repetida
        const res = await request(app)
            .post("/consultations/" + consultationAlreadySigned + "/sign")
            .set("Authorization", "Bearer " + doctorToken);


        //verifico error de conflicto
        expect(res.status).toBe(409);
    });


    it("400 no deja firmar una consulta sin ai_summary", async () => {

        //intento firmar sin resumen generado
        const res = await request(app)
            .post("/consultations/" + consultationWithoutSummary + "/sign")
            .set("Authorization", "Bearer " + doctorToken);


        //verifico error de datos incompletos
        expect(res.status).toBe(400);
    });


    it("404 no encuentra una consulta que no existe", async () => {

        //busco una consulta inexistente
        const res = await request(app)
            .post("/consultations/999999999/sign")
            .set("Authorization", "Bearer " + doctorToken);


        //verifico que no existe
        expect(res.status).toBe(404);
    });

});