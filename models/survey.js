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
    questions: []
})


module.exports = mongoose.model('Survey', surveySchema)
