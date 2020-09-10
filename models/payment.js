require('../src/mongoose-connect')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const paymentSchema = new mongoose.Schema({
    payment_id: {
        type: String,
        unique: true,
        required: true
    },
    payer_id: {
      type: String,
      required: true
    },
    state: {
        type: String,
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    payer_email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        validate: [validateEmail, 'Please fill a valid email address']
    }
})

paymentSchema.plugin(uniqueValidator);

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment