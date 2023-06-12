const request = require("supertest");
const app = require("./index");
const fs = require("fs");
const axios = require("axios");

jest.mock("fs");
jest.mock("axios");

describe("POST /Games", () => {
  test("should return an array of games when genres are provided", async () => {
    // Mock the access token file
    jest
      .spyOn(fs, "readFileSync")
      .mockReturnValue(JSON.stringify({ access_token: "test-access-token" }));

    // Mock the Twitch API call
    jest.spyOn(axios, "post").mockReturnValue(
      Promise.resolve({
        data: { access_token: "test-access-token" },
      })
    );

    // Mock the IGDB API call
    axios.get.mockReturnValue(
      Promise.resolve({
        data: [
          { name: "Game 1", cover: { url: "https://example.com/game1.jpg" } },
          { name: "Game 2", cover: { url: "https://example.com/game2.jpg" } },
        ],
      })
    );

    const res = await request(app)
      .post("/Games")
      .send({ genres: ["Action", "Adventure"] });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      { name: "Game 1", cover: { url: "https://example.com/game1.jpg" } },
      { name: "Game 2", cover: { url: "https://example.com/game2.jpg" } },
    ]);
  });

  test("should return 400 when genres are not provided", async () => {
    const res = await request(app).post("/Games").send({});

    expect(res.statusCode).toEqual(400);
  });
});
