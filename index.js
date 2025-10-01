const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const productAdminRoutes = require('./routes/admin/product')
app.use('/admin', productAdminRoutes)

const productRoutes = require('./routes/product')
app.use(productRoutes)

const sequelize = require("./util/db");
const models = require("./models/index");
sequelize.models = models;

sequelize
  .sync()
  .then(() => {
    console.log("Tabelid loodud");
    app.listen(3002);
  })
  .catch((error) => console.log(error));

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => console.log("Unable to connect to DB", error));

app.get("/", (req, res) => {
  res.json({ message: "web shop" });
});


