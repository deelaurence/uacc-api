const route = require("express").Router();
const AdminAuth = require("../middleware/admin-auth");
const {
  getPayments,
  getSinglePayment,
} = require("../controllers/payment");

route.get("/:id", AdminAuth, getSinglePayment);
route.get("/", AdminAuth, getPayments);

module.exports = route;
