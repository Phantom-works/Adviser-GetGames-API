const express = require("express");
const cors = require("cors");
const igdb = require("igdb-api-node").default;
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;

// Set access token to env variable

const { setAccessToken } = require("./twitchKeyManager");

// Paste it's alive on program startup
app.listen(PORT, () => {
  console.log(`Its alive on http://localhost:${PORT}`);
});

// Listen for post request
app.post("/Games", async (req, res) => {
  if (!req.body.genres) {
    return res.status(400).send("Genres field is missing in the request body");
  }

  await setAccessToken();

  const genres = req.body.genres;

  const games = await igdb()
    .limit(5) // limit to 50 results
    .fields("name,cover.url")

    .where(`genres.slug = ("${genres.join('","')}")`)

    .request("/games"); // execute the query and return a response object

  res.status(200).send(games.data);
});

module.exports = app;
