require('../src/mongoose-connect')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const findOrCreate = require('mongoose-find-or-create')


const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address']
    },
    picture: {
        type: String
    }
})

userSchema.plugin(findOrCreate)

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema)

module.exports = User


