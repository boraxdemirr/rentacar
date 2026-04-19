const express = require("express");
const app = express();

app.use((req, res, next) => {
  console.log("ISTEK GELDI:", req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("ANA SAYFA CALISIYOR");
});

app.get("/test", (req, res) => {
  res.send("TEST TAMAM");
});

app.use((req, res) => {
  res.status(404).send("EXPRESS 404 " + req.url);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("CALISIYOR", PORT);
});