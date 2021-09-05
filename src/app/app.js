"use strict"
const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const corsOptions = require("./config/cors");
const error = require("./middlewares/error");
const notfound = require("./middlewares/error");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../../swagger.json");

// logger
app.use(logger("dev"));

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// swagger
 app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// config
require("./config/config")();

require("express-async-errors"); // for error handeler async

// DB Config
require("./startup/db")();

// core
app.use(cors(corsOptions));

// Agenda UP
require("./helper/agenda").startUp();

// Routes
require("./startup/routes")(app);

// error handler
app.use(error);

// not found handler
app.use(notfound);

// production
require("./startup/prod")(app);

module.exports = app;