// boilerplate express
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/html/signup.html");
});

app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/public/html/dashboard.html");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
