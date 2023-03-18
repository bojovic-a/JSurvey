const mongoose = require('mongoose')
const quesionSchema = require('./question')

const surveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    questions: [],
    owner: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Survey', surveySchema, "Survey")
