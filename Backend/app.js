require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const router = require("./routes/router");

const app = express();

// //To protect the server
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
    contentSecurityPolicy: false,
  })
);

//To allow the front end access to the server
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//To prevent too many requests
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many request please try again later",
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use(router);

module.exports = app;
