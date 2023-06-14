const request = require("supertest");
const app = require("./index");

jest.mock("fs");
jest.mock("axios");

describe("POST /Games", () => {
  test("should return 400 when genres are not provided", async () => {
    const res = await request(app).post("/Games").send({});
    expect(res.statusCode).toEqual(400);
  });
});
