const route = require("express").Router();
const {
    verifyPaymentCallback,
    webhookVerification
} = require("../controllers/payment");

route.post("/webhook", webhookVerification);
route.get("/callback", verifyPaymentCallback);

module.exports = route;
