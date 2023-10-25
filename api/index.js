//imports
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

//middleware
app.use(express.json());
app.use(cors());
dotenv.config();
const port = process.env.SERVER_PORT || 5000;

//import database connection
const { connect } = require("../config/database/db.js");
const routes = require("../src/routes/main/routes.js");
app.use(routes);

//starting the server
async function start() {
  try {
    await connect();
    console.log("Connected to database");
    app.get("/", (req, res) => {
      res.send("welcome to the server");
      console.log("welcome to the server");
    });
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

start();
