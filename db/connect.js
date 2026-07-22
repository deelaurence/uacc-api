const mongoose = require("mongoose");

const connectDB = (url) => {
  if (url.startsWith("mongodb+srv")) {
    console.log("connected to cloud db");
  } else {
    console.log("connected to local database");
  }
  return mongoose.connect(url);
};

module.exports = connectDB;
