import request from "supertest";
import type { Express } from "express";
import { conexionDB } from "../../config/db";

export const TEST_PASSWORD = "password123";

export interface TestDoctor {
    id: number;
    email: string;
    password: string;
    cookies: string[];
    agent: ReturnType<typeof request.agent>;
}

// unique email per call so suites running in parallel never collide on the shared test db
export async function createTestDoctor(app: Express, label = "doctor"): Promise<TestDoctor> {

    const email = `${label}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}@test.com`;

    const registerRes = await request(app)
        .post("/auth/register")
        .set("X-Requested-With", "XMLHttpRequest")
        .send({ name: `Test ${label}`, email, password: TEST_PASSWORD });

    if (registerRes.status !== 201) {
        throw new Error(`Test doctor registration failed with status ${registerRes.status}`);
    }

    // the agent keeps the httpOnly cookies from the login response for every later request
    const agent = request.agent(app).set("X-Requested-With", "XMLHttpRequest");

    const loginRes = await agent
        .post("/auth/login")
        .send({ email, password: TEST_PASSWORD });

    if (loginRes.status !== 200) {
        throw new Error(`Test doctor login failed with status ${loginRes.status}`);
    }

    return {
        id: registerRes.body.data.insertId,
        email,
        password: TEST_PASSWORD,
        cookies: loginRes.headers["set-cookie"] as unknown as string[],
        agent,
    };
}

// consultations.doctor_id has no cascade, so they go first; patients, memory and chunks cascade from the doctor
export async function deleteTestDoctors(doctorIds: number[]): Promise<void> {

    if (doctorIds.length === 0) return;

    await conexionDB.query("DELETE FROM consultations WHERE doctor_id IN (?)", [doctorIds]);
    await conexionDB.query("DELETE FROM doctors WHERE id IN (?)", [doctorIds]);
}
