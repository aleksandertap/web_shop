const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const sequelize = require("./util/db");

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => console.log("Unable to connect to DB", error));

app.get("/", (req, res) => {
  res.json({ message: "web shop" });
});

app.listen(3027);
