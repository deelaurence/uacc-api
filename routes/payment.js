const auth = require("../middleware/authentication");
const route = require("express").Router();
const {
  chargePayment,
  chargeGuestPayment,
  verifyPaymentCallback,
  verifyPaymentByReference,
  getPublicPaymentTags,
  getPaymentConfig,
  getFeeEstimate,
} = require("../controllers/payment");

route.get("/tags", getPublicPaymentTags);
route.get("/payment-config", getPaymentConfig);
route.get("/fee-estimate", getFeeEstimate);
route.post("/guest-initiate", chargeGuestPayment);
route.post("/initiate", auth, chargePayment);
route.get("/callback", verifyPaymentCallback);
route.get("/verify/:reference", verifyPaymentByReference);

module.exports = route;
