const mongoose = require('mongoose')


const answerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
})

const quesionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        required: true
    },
    answers: [answerSchema]
})

const surveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    questions: [quesionSchema]
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)