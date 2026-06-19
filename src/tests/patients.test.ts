import request from "supertest";
import app from "../../app";
import { conexionDB } from "../config/db";
import { getAuthToken } from "./helpers/auth.helper";


describe("Patients API", () => {

    let token: string;
    let doctor2Token: string;
    let patientId: number;
    let doctor2PatientId: number;


    beforeAll(async () => {


        // Limpieza
        await conexionDB.execute(
            "DELETE FROM patients"
        );


        await conexionDB.execute(
            "DELETE FROM doctors WHERE email IN (?,?)",
            [
                "doctor@test.com",
                "doctor2@test.com"
            ]
        );



        // Doctor principal
        await request(app)
            .post("/auth/register")
            .send({

                name: "Doctor Test",
                email: "doctor@test.com",
                password: "123456"

            });



        token = await getAuthToken(app);



        // Segundo doctor para probar IDOR
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



        // Paciente privado doctor2
        const patientRes = await request(app)
            .post("/patients")
            .set("Authorization", `Bearer ${doctor2Token}`)
            .send({

                name: "Paciente Doctor2"

            });



        doctor2PatientId = patientRes.body.patient.id;


    });



    afterAll(async () => {

        await conexionDB.end();

    });




    // Crea un paciente nuevo con datos validos y guarda su id para los tests siguientes
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



        patientId = res.body.patient.id;


    });


    // Lista todos los pacientes del doctor logueado y verifica que devuelva un array
    test("Must list doctor's patients", async () => {


        const res = await request(app)
            .get("/patients")
            .set("Authorization", `Bearer ${token}`);



        expect(res.status)
            .toBe(200);



        expect(Array.isArray(res.body.data))
            .toBe(true);


    });



    // Busca el paciente recien creado por su id y confirma que sea el mismo
    test("Must get patient by ID", async () => {


        const res = await request(app)
            .get(`/patients/${patientId}`)
            .set("Authorization", `Bearer ${token}`);



        expect(res.status)
            .toBe(200);



        expect(res.body.data.id)
            .toBe(patientId);


    });



    // Actualiza el nombre del paciente propio y verifica el mensaje de exito
    test("Must update patient", async () => {


        const res = await request(app)
            .patch(`/patients/${patientId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({

                name: "Paciente Actualizado"

            });



        expect(res.status)
            .toBe(200);



        expect(res.body.message)
            .toBe("Patient information updated succesfully");


    });




    // Elimina el paciente propio y verifica el mensaje de confirmacion
    test("Must delete patient", async () => {


        const res = await request(app)
            .delete(`/patients/${patientId}`)
            .set("Authorization", `Bearer ${token}`);



        expect(res.status)
            .toBe(200);



        expect(res.body.message)
            .toBe("Patient information deleted");


    });



    // Intenta crear un paciente sin token y espera que el middleware lo rechace
    test("Must reject request without token", async () => {


        const res = await request(app)
            .post("/patients")
            .send({

                name: "No Token"

            });



        expect(res.status)
            .toBe(401);


    });


    // Intenta crear un paciente sin el campo name y espera 400 por validacion de Zod
    test("Must reject invalid patient data", async () => {


        const res = await request(app)
            .post("/patients")
            .set("Authorization", `Bearer ${token}`)
            .send({

            });



        expect(res.status)
            .toBe(400);


    });


    // Intenta acceder con el token del doctor principal a un paciente del doctor2 y espera 404
    test("Must prevent IDOR - doctor cannot access another doctor's patient", async () => {


        const res = await request(app)
            .get(`/patients/${doctor2PatientId}`)
            .set("Authorization", `Bearer ${token}`);



        expect(res.status)
            .toBe(404);


    });



});