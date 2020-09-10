require('../src/mongoose-connect')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const wordPairSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        unique: true
    },
    meaning: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
})

wordPairSchema.plugin(uniqueValidator);

const Word = mongoose.model('Word', wordPairSchema)

module.exports = Word


