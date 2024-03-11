require("dotenv").config({ path: "../env/.env" });
// console.log(process.env);
const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("../models");
const { connect } = require("./redis/redis.js");

const router = require("./router/index.js");

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// app.use("/api/v1", (req, res) => {
//   res.send("success");
// });

connect();

app.use("/api/v1", router);

const port = 8000;

const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

dbConnect();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
