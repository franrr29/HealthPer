//Tests

import request from "supertest";
import app from "../../app";


describe("HealthPer API", () => {

  test("server responde", async () => {

    const res = await request(app)
      .get("/health");


    expect(res.status)
      .toBe(200);

  });

});