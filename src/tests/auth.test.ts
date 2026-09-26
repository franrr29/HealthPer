import request from "supertest";
import app from "../app";
import { conexionDB } from "../config/db";
import { createTestDoctor, deleteTestDoctors, TEST_PASSWORD, TestDoctor } from "./helpers/auth.helper";

const cookieNames = (cookies: string[]) => cookies.map((cookie) => cookie.split("=")[0]);

describe("Auth API", () => {

    let doctor: TestDoctor;
    const createdDoctorIds: number[] = [];

    beforeAll(async () => {
        doctor = await createTestDoctor(app, "auth");
        createdDoctorIds.push(doctor.id);
    });

    afterAll(async () => {
        await deleteTestDoctors(createdDoctorIds);
        await conexionDB.end();
    });

    describe("POST /auth/register", () => {

        test("registers a doctor", async () => {
            const email = `auth.register.${Date.now()}@test.com`;

            const res = await request(app)
                .post("/auth/register")
                .send({ name: "Doctor Register", email, password: TEST_PASSWORD });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.insertId).toEqual(expect.any(Number));

            createdDoctorIds.push(res.body.data.insertId);
        });

        test("409 rejects an email that is already registered", async () => {
            const res = await request(app)
                .post("/auth/register")
                .send({ name: "Duplicado", email: doctor.email, password: TEST_PASSWORD });

            expect(res.status).toBe(409);
            expect(res.body).toEqual({ success: false, message: "Doctor already exists" });
        });

        test("400 rejects invalid data with the validation messages", async () => {
            const res = await request(app)
                .post("/auth/register")
                .send({ name: "Sin email valido", email: "no-es-un-email", password: "123" });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain("email");
            expect(res.body.message).toContain("password");
        });
    });

    describe("POST /auth/login", () => {

        test("sets httpOnly access and refresh cookies and no token in the body", async () => {
            const res = await request(app)
                .post("/auth/login")
                .send({ email: doctor.email, password: doctor.password });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe(doctor.email);
            expect(res.body.data.password_hash).toBeUndefined();
            expect(res.body.data.token).toBeUndefined();

            const cookies = res.headers["set-cookie"] as unknown as string[];

            expect(cookieNames(cookies)).toEqual(expect.arrayContaining(["accessToken", "refreshToken"]));
            cookies.forEach((cookie) => expect(cookie).toContain("HttpOnly"));
        });

        test("401 rejects a wrong password", async () => {
            const res = await request(app)
                .post("/auth/login")
                .send({ email: doctor.email, password: "wrongpassword" });

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ success: false, message: "Invalid credentials" });
        });

        test("401 answers the same for an email that does not exist", async () => {
            const res = await request(app)
                .post("/auth/login")
                .send({ email: "noexiste.123@test.com", password: TEST_PASSWORD });

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ success: false, message: "Invalid credentials" });
        });
    });

    describe("protected routes", () => {

        test("401 without an access token cookie", async () => {
            const res = await request(app).get("/patients");

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ success: false, message: "Access token not provided" });
        });

        test("401 with an invalid access token cookie", async () => {
            const res = await request(app)
                .get("/patients")
                .set("Cookie", ["accessToken=tokenInventado123"]);

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ success: false, message: "Invalid or expired token" });
        });

        test("200 with the cookies of a logged in doctor", async () => {
            const res = await doctor.agent.get("/doctor/me");

            expect(res.status).toBe(200);
            expect(res.body.data.email).toBe(doctor.email);
        });
    });

    describe("POST /auth/refresh", () => {

        test("issues a new access token cookie from the refresh cookie", async () => {
            const res = await doctor.agent.post("/auth/refresh");

            expect(res.status).toBe(200);

            const cookies = res.headers["set-cookie"] as unknown as string[];

            expect(cookieNames(cookies)).toContain("accessToken");
        });

        test("401 without a refresh cookie", async () => {
            const res = await request(app).post("/auth/refresh");

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ success: false, message: "Refresh token not provided" });
        });

        test("401 with an invalid refresh cookie", async () => {
            const res = await request(app)
                .post("/auth/refresh")
                .set("Cookie", ["refreshToken=tokenInventado123"]);

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ success: false, message: "Invalid or expired refresh token" });
        });
    });

    describe("POST /auth/logout", () => {

        test("clears both cookies", async () => {
            const res = await request(app).post("/auth/logout");

            expect(res.status).toBe(200);

            const cookies = res.headers["set-cookie"] as unknown as string[];

            expect(cookieNames(cookies)).toEqual(expect.arrayContaining(["accessToken", "refreshToken"]));
            cookies.forEach((cookie) => expect(cookie).toMatch(/Expires=Thu, 01 Jan 1970/));
        });
    });
});
