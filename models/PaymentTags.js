const mongoose = require('mongoose');

const paymentTagSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const PaymentTag = mongoose.model('PaymentTag', paymentTagSchema);


module.exports = PaymentTag 