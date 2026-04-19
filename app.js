const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("ANA SAYFA CALISIYOR");
});

app.get("/test", (req, res) => {
  res.send("TEST TAMAM");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("CALISIYOR", PORT);
});