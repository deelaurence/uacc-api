const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    }
});

const Payment = mongoose.model('Payment', paymentSchema);


module.exports = Payment 