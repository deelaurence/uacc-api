const express = require("express");
const route = express.Router();
const { login, register, verifyEmail, deleteUser } = require("../controllers/authController");
const { editPassword } = require('../controllers/modifyUserC')
route.post("/login", login);
route.get("/verify-mail/:signature", verifyEmail)
route.get("/delete/:email", deleteUser)
route.post("/register", register);
route.put('/edit-password', editPassword)
module.exports = route;
