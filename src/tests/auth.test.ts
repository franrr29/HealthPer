import request from "supertest";
import app from "../../app";
import { conexionDB } from "../config/db";


// Testear rutas de autenticación
describe("Auth API", () => {


    // corre antes de todos los tests del describe
    beforeAll(async () => {

        await conexionDB.execute(
            "DELETE FROM doctors WHERE email = ?",
            ["doctor@test.com"]
        );

    });



    // corre despues de todos los tests del describe
    afterAll(async () => {

        await conexionDB.end();

    });



    // Testear registrar un doctor
    test("must register a doctor", async () => {


        const res = await request(app)
            .post("/auth/register")
            .send({
                name: "Doctor Test",
                email: "doctor@test.com",
                password: "123456"
            });


        expect(res.status)
            .toBe(201);


        expect(res.body.success)
            .toBe(true);


    });



    // Testear loguear un doctor
    test("Must login a doctor", async () => {


        const res = await request(app)
            .post("/auth/login")
            .send({
                email: "doctor@test.com",
                password: "123456"
            });


        expect(res.status)
            .toBe(200);


        expect(res.body.success)
            .toBe(true);


        expect(res.body.data.token)
            .toBeDefined();


    });



    // Testear doctor con credenciales incorrectas
    test("Must not login a doctor with incorrect credentials", async () => {


        const res = await request(app)
            .post("/auth/login")
            .send({
                email: "doctor@test.com",
                password: "wrongpassword"
            });


        expect(res.status)
            .toBe(401);


        expect(res.body.success)
            .toBe(false);


    });



    // Testear login con usuario inexistente
    test("Must not login a doctor that does not exist", async () => {


        const res = await request(app)
            .post("/auth/login")
            .send({
                email: "noexiste123_1..s@test.com",
                password: "123456"
            });


        expect(res.status)
            .toBe(401);


        expect(res.body.success)
            .toBe(false);


    });



    // Testear sin token de autenticacion
    test("Must not access protected route without token", async () => {


        const res = await request(app)
            .get("/patients/1/consultations");


        expect(res.status)
            .toBe(401);


        expect(res.body.success)
            .toBe(false);


    });



    // Testear token invalido
    test("Must not access protected route with invalid token", async () => {


        const res = await request(app)
            .get("/patients/1/consultations")
            .set(
                "Authorization",
                "Bearer tokenInventado123"
            );


        expect(res.status)
            .toBe(401);


        expect(res.body.message)
            .toBe("Invalid or expired token");


    });


});