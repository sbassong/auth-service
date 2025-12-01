require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
const rateLimit = require('express-rate-limit');
const db = require("./db")
const PORT = process.env.PORT || 3001;

const AppRouter = require("./routes");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: {
    status: "Error",
    msg: "Too many requests, please try again later.",
  },
  standardHeaders: true,
});

app.use(limiter);
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", AppRouter);

// hook into the database connection events
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.listen(PORT, () => console.log(`Server Started On Port: ${PORT}`));
