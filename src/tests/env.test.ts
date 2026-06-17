import { env } from "../config/env";

describe("env test", () => {

  test("debe usar healthper_test", () => {

    expect(env.DB_NAME)
      .toBe("healthper_test");

  });

});