const express = require("express");
const app = express();

const PORT = 8080;

require("dotenv").config();

const igdb = require("igdb-api-node").default;
const axios = require("axios");
const fs = require("fs");

// Set access token to env variable
process.env.TWITCH_APP_ACCESS_TOKEN = JSON.parse(
  fs.readFileSync("accessToken.json")
).access_token;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Its alive on http://localhost:${PORT}`);
});
app.get("/", async (req, res) => {
  setAccessToken();

  const genres = req.body.genres;

  const games = await igdb()
    .limit(5) // limit to 50 results
    .fields("name,cover.url")

    .where(`genres.slug = ("${genres.join('","')}")`)

    .request("/games"); // execute the query and return a response object

  res.status(200).send(games.data);
});

// Function to check if access token has expired and set a new one if needed
function setAccessToken() {
  if (checkIfTokenExpired()) {
    setNewAccessToken();
  }
}

// Function to check if access token has expired
function checkIfTokenExpired() {
  // Check if stored expire date is bigger than current date
  return (
    JSON.parse(fs.readFileSync("accessToken.json")).expires_at <=
    Date.now() / 1000
  );
}

// Function to set a new access token
async function setNewAccessToken() {
  token = await retrieveAccessToken();
  process.env.TWITCH_APP_ACCESS_TOKEN = token;
  storeAccessTokenInJson(token);
}

// Function to retrieve a new access token from the Twitch API
async function retrieveAccessToken() {
  const response = await axios.post("https://id.twitch.tv/oauth2/token", {
    client_id: TWITCH_CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "client_credentials",
  });
  return response.data;
}

// Function to store the new access token in the accessToken.json file
async function storeAccessTokenInJson(_token) {
  let token = {
    access_token: _token.access_token,
    expires_in: _token.expires_in,
    expires_at: getExpiryDate(_token.expires_in),
    token_type: _token.token_type,
  };

  fs.writeFileSync("accessToken.json", JSON.stringify(token));
}

// Function to calculate the expiry date of the access token
function getExpiryDate(_secTilExpiry) {
  return Date.now() / 1000 + _secTilExpiry + 240;
}