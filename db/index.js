const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/authDatabase";

mongoose
  .connect(MONGODB_URI, {dbName: "cs-290"})
  .then(() => console.log("Successfully connected to MongoDB."))
  .catch((e) => console.error("Connection error", e.message));

const db = mongoose.connection;

module.exports = db;
