require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
const db = require("./db")
const PORT = process.env.PORT || 3001;

const AppRouter = require("./routes");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", AppRouter);

// hook into the database connection events
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.listen(PORT, () => console.log(`Server Started On Port: ${PORT}`));
