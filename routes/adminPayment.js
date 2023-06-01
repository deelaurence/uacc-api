const route = require("express").Router();
const {
    getPayments, getSinglePayment
} = require("../controllers/payment");

//admin
route.get("/:id", getSinglePayment);
route.get("/", getPayments);

module.exports = route;
