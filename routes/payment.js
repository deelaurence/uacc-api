
const auth=require("../middleware/authentication")
const route = require("express").Router();

const {
    chargePayment,
    verifyPaymentCallback,
    webhookVerification
} = require("../controllers/payment");

route.post("/initiate", auth, chargePayment);
route.post("/webhook", webhookVerification);
route.get("/callback", verifyPaymentCallback);

module.exports = route;
