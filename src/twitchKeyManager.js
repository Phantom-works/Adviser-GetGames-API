const fs = require("fs");
const axios = require("axios");

module.exports = {
  setAccessToken : function() {
  if (checkIfTokenExpired()) {
    setNewAccessToken();
  }
}
}

// Function to check if access token has expired and set a new one if needed

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
  const token = await retrieveAccessToken();
  process.env.TWITCH_APP_ACCESS_TOKEN = token;
  storeAccessTokenInJson(token);
}

// Function to retrieve a new access token from the Twitch API
async function retrieveAccessToken() {
  const response = await axios.post("https://id.twitch.tv/oauth2/token", {
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
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