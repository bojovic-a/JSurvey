const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    answers: [String]
})

module.exports = mongoose.model('Question', questionSchema, "Question")