const express = require("express");
const route = express.Router();
const { login, logout, register, verifyEmail, deleteUser, verifyEmailPasswordReset, verifiedEmailPasswordReset, updatePassword } = require("../controllers/authController");
const { editPassword } = require('../controllers/modifyUserC')
route.post("/login", login);
route.post("/logout", logout);
route.get("/verify-mail/:signature", verifyEmail)
//Client initiates a mail that verifies thier email
route.post("/forgot-password", verifyEmailPasswordReset)
//Client clicks on mail and the "canResetPassword" property is turned true
route.get("/verify-mail-password-reset/:signature", verifiedEmailPasswordReset)
//Finally update the password
route.put("/update-password", updatePassword);
route.get("/delete/:email", deleteUser)
route.post("/register", register);
route.put('/edit-password', editPassword)
module.exports = route;
