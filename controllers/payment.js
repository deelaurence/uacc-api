require("dotenv").config();
const paystack = require('paystack')(process.env.paystack_test_secret_key);
const User = require('../models/UserModel')

const chargePayment = async (req, res) => {
    try {
        // Create a new transaction
        const userId = req.decoded.id
        const user = await User.findOne({ _id: userId })
        const transaction = await paystack.transaction.initialize({
            amount: req.body.amount * 100, // Amount in kobo (100000 kobo = ₦1,000)
            email: user.email,
            metadata: {
                description: req.body.description
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
const webhookVerification = (req, res) => {
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
    // Handle the event based on the event type
    if (eventType === 'charge.success') {

        // save eventData to db
    }
    else if (eventType === 'charge.failed') {
        // Handle failed payment event
        console.log('Payment failed.');
        // Take appropriate actions like notifying the user, logging the failure, etc.
    } else if (eventType === 'charge.refunded') {
        // Handle refunded payment event
        console.log('Payment refunded.');
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
            const reference = response.data.data.reference
            res.redirect(`https://mt-of-mercy.netlify.app/#/receipt?amount=${amount}&description=${description}&reference=${reference}`);
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
module.exports = { chargePayment, verifyPaymentCallback, webhookVerification }
// //paystack config
// const { Payment } = require('../models/Payment')
// const request = require('request');
// const _ = require('lodash');
// const { initializePayment, verifyPayment } = require('./paymentConfig')(request);
// const paymentRequest = (req, res) => {
//     try {
//         req.body.email = req.decoded.email
//         console.log(req.body)
//         if (!req.body.amount && !req.body.full_name && !req.body.email) {
//             return res.json({ message: "email, amount or name missing" })
//         }
//         // return
//         const form = _.pick(req.body, ['amount', 'email', 'full_name']);
//         form.metadata = {
//             full_name: form.full_name
//         }
//         form.amount *= 100;

//         initializePayment(form, (error, body) => {
//             try {
//                 if (error) {
//                     //handle errors
//                     console.log(error);
//                     return res.json({ error })
//                     return;
//                 }
//                 response = JSON.parse(body);
//                 console.log(response)
//                 // return
//                 res.json({ link: response.data.authorization_url })
//             }
//             catch (error) {
//                 res.json({ error })
//             }
//         });
//     } catch (error) {
//         res.json({ error })
//     }
// }

// const verifyRequest = (req, res) => {
//     try {
//         const ref = req.query.reference;
//         verifyPayment(ref, (error, body) => {
//             if (error) {
//                 //handle errors appropriately
//                 console.log(error)
//                 return res.json({ message: "payment verification" });
//             }
//             response = JSON.parse(body);

//             const data = _.at(response.data, ['reference', 'amount', 'customer.email', 'metadata.full_name']);

//             [reference, amount, email, full_name] = data;
//             let newPayment = { reference, amount, email, full_name }
//             const payment = new Payment(newPayment)
//             payment.save().then((payment) => {
//                 if (!payment) {
//                     return res.json({ message: "something happened" });
//                 }
//                 res.status(201).json(payment);
//             }).catch((e) => {
//                 res.json({ message: e });
//             })
//         })
//     } catch (error) {
//         res.json({ error })
//     }
// }
// const getReceipt = (req, res) => {
//     try {
//         const id = req.params.id;
//         Payment.findById(id).then((payment) => {
//             if (!payment) {
//                 //handle error when the payment is not found
//                 res.redirect('/error')
//             }
//             res.render('success.pug', { payment });
//         }).catch((e) => {
//             res.redirect('/error')
//         })
//     }
//     catch (error) {
//         res.json({ error })
//     }
// }
// const getPayments = async (req, res) => {
//     try {
//         const transactions = await Payment.find({})
//         if (transactions < 1) {
//             return res.json({ message: "no payments yet" })
//         }
//         res.json(transactions)
//     } catch (error) {
//         res.json({ error })
//     }
// }
// const getUserPayment = async (req, res) => {
//     try {
//         const transaction = await Payment.find({ email: req.decoded.email })
//         if (!transaction) {
//             return res.json({ message: "no payments yet" })
//         }
//         res.json(transaction)
//     } catch (error) {
//         res.json({ error })
//     }
// }

// module.exports = { paymentRequest, verifyRequest, getReceipt, getPayments, getUserPayment }
// module.exports = { chargePayment, verifyPaymentCallback }
