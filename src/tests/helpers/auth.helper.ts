//Funcion que obtiene token de autenticacion para usar en los tests:

import request from "supertest";
import { Express } from "express";


export async function getAuthToken(app: Express): Promise<string> {

    try {

        const res = await request(app)
            .post("/auth/login")
            .send({
                email: "doctor@test.com",
                password: "123456"
            });

        return res.body.data.token;

    } catch (error) {

        throw new Error("Failed to retrieve auth token");
    }
}