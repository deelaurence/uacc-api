require("dotenv").config();
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { initializeTransaction, logPaymentError } = require('../utils/paystackClient');
const {
  verifyAndSyncPayment,
  verifyAndSyncWithStatus,
  toPublicReceipt,
} = require('../services/paymentVerification');
const User = require('../models/UserModel');
const Payment = require('../models/Payment');
const PaymentTag = require('../models/PaymentTags');
const { getAllPaymentTags } = require('./admin');
const {
  NotFound,
  BadRequest,
} = require("../errors/customErrors");

const clientUrl = `${process.env.CLIENT_URL}/#`;
const secretKey = process.env.paystack_key;
const GUEST_OFFERING_DESCRIPTION = 'Offering';

const { parseAmountKobo } = require('../utils/money');
const { buildPaymentAmounts } = require('../utils/paystackFees');
const { isUserFootingCharges, FEE_REASON } = require('../config/env');

const buildInitiateResponse = (transaction, amounts) => ({
  redirect: transaction.data.authorization_url,
  userFootsCharges: amounts.userFootsCharges,
  netKobo: amounts.netKobo,
  feeKobo: amounts.feeKobo,
  chargeKobo: amounts.chargeKobo,
  ...(amounts.userFootsCharges ? { feeReason: FEE_REASON } : {}),
});

const buildPaymentMetadata = (amounts, metadata = {}) => ({
  ...metadata,
  intendedNetKobo: String(amounts.netKobo),
  processingFeeKobo: String(amounts.feeKobo),
  userFootsCharges: String(amounts.userFootsCharges),
});

const buildGuestEmail = () => {
  const guestId = uuidv4().slice(0, 8);
  if (process.env.GUEST_PAYMENT_EMAIL) {
    return { email: process.env.GUEST_PAYMENT_EMAIL, guestId };
  }
  const domain = process.env.GUEST_EMAIL_DOMAIN || 'mtofmercy.org';
  return { email: `guest+${guestId}@${domain}`, guestId };
};

const chargeGuestPayment = async (req, res) => {
  try {
    const amountKobo = parseAmountKobo(req.body.amountKobo);
    const name = (req.body.name || '').trim() || 'Guest';
    const { email, guestId } = buildGuestEmail();
    const amounts = buildPaymentAmounts(amountKobo);

    const transaction = await initializeTransaction({
      amount: amounts.chargeKobo,
      email,
      metadata: buildPaymentMetadata(amounts, {
        description: GUEST_OFFERING_DESCRIPTION,
        name,
        userId: `guest:${guestId}`,
        isGuest: 'true',
      }),
    });

    res.json(buildInitiateResponse(transaction, amounts));
  } catch (error) {
    logPaymentError('guest-initiate', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Something went wrong with payment, Try again',
    });
  }
};

const chargePayment = async (req, res) => {
  try {
    const userId = req.decoded.id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new NotFound("User not found");
    }

    const amountKobo = parseAmountKobo(req.body.amountKobo);
    const { description } = req.body;
    const amounts = buildPaymentAmounts(amountKobo);

    if (!description) {
      throw new BadRequest('description is required');
    }

    const allowedTag = await PaymentTag.findOne({ tag: description });
    if (!allowedTag) {
      throw new BadRequest('Invalid payment description');
    }

    const transaction = await initializeTransaction({
      amount: amounts.chargeKobo,
      email: user.email,
      metadata: buildPaymentMetadata(amounts, {
        description,
        name: user.name,
        userId: String(user._id),
      }),
    });

    res.json(buildInitiateResponse(transaction, amounts));
  } catch (error) {
    logPaymentError('initiate', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Something went wrong with payment, Try again',
    });
  }
};

function verifyWebhookSignature(headerSignature, requestPayload) {
  if (!headerSignature || typeof headerSignature !== 'string') {
    return false;
  }

  const computedSignature = crypto
    .createHmac("sha512", secretKey)
    .update(requestPayload)
    .digest("hex");

  const computedBuffer = Buffer.from(computedSignature, 'utf8');
  const headerBuffer = Buffer.from(headerSignature, 'utf8');

  if (computedBuffer.length !== headerBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(computedBuffer, headerBuffer);
}

const webhookVerification = async (req, res) => {
  try {
    const headerSignature = req.headers["x-paystack-signature"];
    const rawBody = req.body;

    if (!Buffer.isBuffer(rawBody)) {
      return res.status(400).send("Invalid webhook payload");
    }

    const isSignatureValid = verifyWebhookSignature(headerSignature, rawBody);
    if (!isSignatureValid) {
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(rawBody.toString("utf8"));
    const eventType = event.event;
    const reference = event.data?.reference;

    if (!reference) {
      return res.sendStatus(200);
    }

    if (eventType === "charge.success") {
      await verifyAndSyncPayment(reference, { requireSuccess: true });
    } else if (eventType === "charge.failed") {
      await verifyAndSyncWithStatus(reference, 'Failed');
    } else if (eventType === "charge.refunded") {
      await verifyAndSyncWithStatus(reference, 'Refunded');
    }

    return res.sendStatus(200);
  } catch (error) {
    logPaymentError('webhook', error);
    return res.status(500).send('Webhook processing failed');
  }
};

const verifyPaymentCallback = async (req, res) => {
  try {
    const reference = req.query.reference;
    if (!reference) {
      return res.redirect(`${clientUrl}/give?error=missing_reference`);
    }

    await verifyAndSyncPayment(reference, { requireSuccess: true });
    return res.redirect(`${clientUrl}/receipt?reference=${encodeURIComponent(reference)}`);
  } catch (error) {
    logPaymentError('callback', error);
    if (error.statusCode === 404) {
      return res.redirect(`${clientUrl}/give?error=payment_failed`);
    }
    return res.redirect(`${clientUrl}/give?error=verification_failed`);
  }
};

const verifyPaymentByReference = async (req, res) => {
  try {
    const { reference } = req.params;
    const { payment, mapped, verified } = await verifyAndSyncPayment(reference, { requireSuccess: true });

    if (verified.status !== 'success') {
      throw new NotFound('Payment not verified with Paystack');
    }

    res.status(200).json(toPublicReceipt(payment, mapped));
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

const getPaymentConfig = async (req, res) => {
  const userFootsCharges = isUserFootingCharges();
  res.json({
    userFootsCharges,
    feeReason: userFootsCharges ? FEE_REASON : null,
  });
};

const getFeeEstimate = async (req, res) => {
  try {
    const amountKobo = parseAmountKobo(req.query.amountKobo);
    const amounts = buildPaymentAmounts(amountKobo);

    res.json({
      ...amounts,
      feeReason: amounts.userFootsCharges ? FEE_REASON : null,
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

const getSinglePayment = async (req, res) => {
  try {
    const PaymentId = req.params.id;
    const query = req.decoded ? { id: PaymentId } : { _id: PaymentId };
    const singlePayment = await Payment.findOne(query);

    if (!singlePayment) {
      throw new NotFound(`no payment with id ${PaymentId}`);
    }

    res.status(200).json(singlePayment);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

const getPayments = async (req, res) => {
  try {
    const allPayments = await Payment.find().sort({ _id: -1 });

    if (allPayments.length < 1) {
      throw new NotFound("No Payment found");
    }

    res.status(200).json(allPayments);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

module.exports = {
  chargePayment,
  chargeGuestPayment,
  verifyPaymentCallback,
  webhookVerification,
  verifyPaymentByReference,
  getPayments,
  getSinglePayment,
  getPublicPaymentTags: getAllPaymentTags,
  getPaymentConfig,
  getFeeEstimate,
};
