const express = require("express");
const route = express.Router();
const { login, register } = require("../controllers/adminAuth");

route.post("/login", login);

route.post("/register", (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ message: "Admin registration is disabled in production" });
  }
  return register(req, res, next);
});

module.exports = route;
//hello