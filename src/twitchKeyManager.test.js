const {setAccessToken} = require ("./twitchKeyManager")
const fs = require("fs");
const axios = require("axios");

jest.mock("fs");
jest.mock("axios");

describe("setAccessToken", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call setNewAccessToken if token has expired", async () => {
    // Mock the result of checkIfTokenExpired to return true
    jest.spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify({
        expires_at: 0, // Expired token
      })
    );

    // Mock the result of retrieveAccessToken to return a new token
    jest.spyOn(axios, "post").mockResolvedValue({
      data: {
        access_token: "newAccessToken",
        expires_in: 3600,
        token_type: "Bearer",
      },
    });

    // Mock the file system writeFileSync method
    jest.spyOn(fs, "writeFileSync");
    // Mock the Date.now method
    jest.spyOn(Date, "now").mockReturnValue(1000)

    await setAccessToken();

    // Verify that setNewAccessToken was called
    expect(fs.readFileSync).toHaveBeenCalledWith("accessToken.json");
    expect(axios.post).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "accessToken.json",
      JSON.stringify({
        expires_in: 3600,
        expires_at: 3841,
        token_type: "Bearer",
      })
    );
  });

  it("should not call setNewAccessToken if token has not expired", () => {
    // Mock the result of checkIfTokenExpired to return false
    jest.spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify({
        expires_at: Date.now() / 1000 + 1000, // Token still valid
      })
    );

    // Mock the file system readFileSync method
    jest.spyOn(fs, "readFileSync");

    setAccessToken();

    // Verify that setNewAccessToken was not called
    expect(fs.readFileSync).toHaveBeenCalledWith("accessToken.json");
    expect(axios.post).not.toHaveBeenCalled();
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });
});