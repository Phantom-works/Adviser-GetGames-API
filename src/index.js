const express = require("express");
const app = express();

const PORT = 8080;

require('dotenv').config()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

app.use(express.json());

app.get("/Games", (req, res) => {
  const { keyword } = req.body;
  const { amount } = req.body;

  if (!amount) {
    res.status(400).send({
      error: "bad-request",
      message: "Please fill in the amount field",
    });
  }
  else if (!keyword) {
    res.status(400).send({
      error: "bad-request",
      message: "Please fill in the keyword field",
    });
  } else {
    res.status(200).send("coming up");
  }
});

app.listen(PORT, () => {
  console.log(`Its alive on http://localhost:${PORT}`);
});
