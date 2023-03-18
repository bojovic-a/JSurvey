const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    answer: {
        type: []
    },
    question_id: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Answer', answerSchema, "Answer")