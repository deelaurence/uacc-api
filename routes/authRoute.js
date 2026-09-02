const express = require("express");
const route = express.Router();
const AdminAuth = require("../middleware/admin-auth");
const {
  login,
  logout,
  register,
  verifyEmail,
  deleteUser,
  verifyEmailPasswordReset,
  verifiedEmailPasswordReset,
  updatePassword,
} = require("../controllers/authController");
route.post("/login", login);
route.post("/logout", logout);
route.get("/verify-mail/:signature", verifyEmail);
route.post("/forgot-password", verifyEmailPasswordReset);
route.get("/verify-mail-password-reset/:signature", verifiedEmailPasswordReset);
route.put("/update-password", updatePassword);
route.get("/delete/:email", AdminAuth, deleteUser);
route.post("/register", register);

module.exports = route;
