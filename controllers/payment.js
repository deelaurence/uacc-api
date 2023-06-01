require("dotenv").config();
const { v4: uuidv4 } = require('uuid');
const { formatDate } = require('../utils/dateFormat')
const paystack = require('paystack')(process.env.paystack_test_secret_key);
const User = require('../models/UserModel')
const Payment = require('../models/Payment')

const chargePayment = async (req, res) => {
    try {
        // Create a new transaction
        const userId = req.decoded.id
        const user = await User.findOne({ _id: userId })
        const transaction = await paystack.transaction.initialize({
            amount: req.body.amount * 100, // Amount in kobo (100000 kobo = ₦1,000)
            email: user.email,
            metadata: {
                description: req.body.description,
                name: user.name
            }
        });
        console.log(req.headers)
        console.log(transaction)
        // Redirect the customer to the payment page
        res.json({ redirect: transaction.data.authorization_url });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).send('Payment error');
    }
}
const crypto = require('crypto');
const secretKey = process.env.paystack_test_secret_key;
function verifyWebhookSignature(headerSignature, requestPayload) {
    const computedSignature = crypto
        .createHmac('sha512', secretKey)
        .update(requestPayload)
        .digest('hex');
    return headerSignature === computedSignature;
}
const webhookVerification = async (req, res) => {
    // Verify the signature
    const headerSignature = req.headers['x-paystack-signature'];
    const isSignatureValid = verifyWebhookSignature(headerSignature, JSON.stringify(req.body));
    if (!isSignatureValid) {
        res.status(400).send('Invalid signature');
        return;
    }

    // Process the webhook event
    const event = req.body;
    const eventType = event.event;
    const eventData = event.data;

    console.log(eventData)
    const payloadEmail = eventData.customer.email
    const payloadDescription = eventData.metadata.description
    const payloadReference = eventData.reference
    const payloadAmount = eventData.amount
    const payloadName = eventData.metadata.name
    const payloadAuth = eventData.authorization.authorization_code
    // Handle the event based on the event type
    if (eventType === 'charge.success') {
        if (payloadAuth) {
            await User.findOneAndUpdate({ email: payloadEmail }, { authCode: payloadAuth })
        }
        // save eventData to db
        await Payment.create({
            owner: payloadEmail,
            id: uuidv4(),
            name: payloadName,
            date: formatDate(),
            status: "Success",
            amount: payloadAmount / 100,
            description: payloadDescription,
            reference: payloadReference,
        })
    }
    else if (eventType === 'charge.failed') {
        await Payment.create({
            owner: payloadEmail,
            id: uuidv4(),
            name: payloadName,
            date: dateFormat(),
            status: "Failed",
            amount: payloadAmount / 100,
            description: payloadDescription,
            reference: payloadReference,
        })
        // Handle failed payment event
        console.log('Payment failed.');
        // Take appropriate actions like notifying the user, logging the failure, etc.
    } else if (eventType === 'charge.refunded') {
        // Handle refunded payment event
        console.log('Payment refunded.');
        await Payment.create({
            owner: payloadEmail,
            id: uuidv4(),
            name: payloadName,
            date: dateFormat(),
            status: "Refunded",
            amount: payloadAmount / 100,
            description: payloadDescription,
            reference: payloadReference,
        })
        // Update your database or trigger any necessary actions related to the refund process
    }
    else {
        // Handle other events as needed
        console.log(eventType)
    }
    // Respond with a success status
    res.sendStatus(200);
}

const axios = require('axios')
// Handle the callback URL
const verifyPaymentCallback = async (req, res) => {
    try {
        const reference = req.query.reference;

        // Verify the transaction
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.paystack_test_secret_key}`,
            },
        });

        // Process the transaction response
        if (response.data.data.status === 'success') {
            // Payment is successful
            // Do something here (e.g., update your database, provide access to content, etc.)
            // res.json({message:"payment sucessful"})
            console.log('Payment successful');
            console.log(response.data)
            const amount = response.data.data.amount / 100
            const description = response.data.data.metadata.description
            const name = response.data.data.metadata.name
            const reference = response.data.data.reference
            res.redirect(`https://mt-of-mercy.netlify.app/#/receipt?amount=${amount}&description=${description}&reference=${reference}&name=${name}`);
        } else {
            // Payment is not successful
            // Do something here (e.g., display an error message, handle failed payment)
            console.log('Payment not successful');
        }

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).send('Verification error');
    }
}

const getSinglePayment = async (req, res) => {
    try {
        const PaymentId = req.params.id
        let query = {
            _id: PaymentId,
        }
        //admin requests have req.decoded
        if (req.decoded) {
            query = { id: PaymentId }
        }
        const singlePayment = await Payment.findOne(query)
        if (!singlePayment) {
            throw new NotFound(
                `no Message with id ${PaymentId} `
            );
        }
        res.status(200).json(singlePayment);
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: error.message });
    }
};
const getPayments = async (req, res) => {
    try {

        let query = {}
        console.log(req.decoded)
        //Requests coming from admin passses thru middleware
        if (req.decoded) {
            query = { owner: req.decoded.id }
        }


        const allPayments = await Payment.find()
            .sort({ createdAt: -1 })
        // .skip(pageOptions.page * pageOptions.limit)
        // .limit(pageOptions.limit);
        if (allPayments.length < 1) {
            throw new NotFound("No Payment found");
        }
        res
            .status(200)
            .json(allPayments);
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error.message);
    }
};
module.exports = { chargePayment, verifyPaymentCallback, webhookVerification, getPayments, getSinglePayment }
