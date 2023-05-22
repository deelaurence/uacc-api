const route = require("express").Router();
const {
    chargePayment,
    verifyPaymentCallback,
    webhookVerification
} = require("../controllers/payment");

route.post("/initiate", chargePayment);
route.post("/webhook", webhookVerification);
route.get("/callback", verifyPaymentCallback);

module.exports = route;
