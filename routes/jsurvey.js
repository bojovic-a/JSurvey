const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const pug = require('pug')
const session = require('express-session')
const bodyParser = require('body-parser')
const User  = require('../models/user.js')
const Question = require('../models/question.js')
const Survey = require('../models/survey.js')
const { json } = require('body-parser')

router.use(express.static('./static'))

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(session({
    secret: 'SECRETKEY', // Replace with your own secret key
    resave: false,
    saveUninitialized: true
}))

//Compiled pug files
const homePage = pug.compileFile('./templates/index.pug')
const registerPage = pug.compileFile('./templates/register.pug')
const loginPage = pug.compileFile('./templates/login.pug')
const makeASurvey = pug.compileFile('./templates/make_a_survey.pug')
const addSurveyName = pug.compileFile('./templates/add_survey_name.pug')

//GET Home
router.get('/', (req, res) => {
    res.send(homePage())
})

//GET Register
router.get('/register', (req, res) => {
    res.send(registerPage())
})
//GET Login
router.get('/login', (req, res) => {
    res.send(loginPage())
})
//GET Choose Survey Title 
router.get('/make-a-survey', (req, res) =>  {
    res.send(addSurveyName())
})

//Render create survey
router.post('/proceed-to-survey', (req, res) => {
    survey_title = req.body['survey-name']
    survey_description = req.body['survey-description']

    req.session.survey_title = survey_title
    req.session.survey_description = survey_description
    
    res.send(makeASurvey({
        title: survey_title
    }))

})

router.post('/save-survey', async (req, res) => {
    questions = req.body["all_questions"]
    // console.log(questions)
    
    all_questions_obj = []
    for (const q of questions) {
        const question = new Question({
            title: q.title,
            type: q.type,
            answers: q.answers
        })
        all_questions_obj.push(question)
        console.log("Pitanje iz petlje" + question)
    }
    console.log(questions)

    const survey = new Survey({
        title: req.session.survey_title,
        description: req.session.survey_description,
        questions: all_questions_obj
    })
    console.log("Nja: " + survey)

    try{
        let insertedSurvey = await survey.save()
        res.send("")
    }catch(err){
        res.status(500).json({message: err.message})
    }

})

//POST Register
router.post('/register', async (req, res) => {
    const userToInsert = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    try{
        let existingUser = await User.find()
        // res.json(existingUser)

        if (existingUser.length) {
            res.send("User with this username already exists")
            return
        }
        else{
            newInsert = await userToInsert.save()
            res.send('Successful registration')
            return
        }

    }catch (err){
        res.status(500).json({message: err.message})
        return
    }
})
//POST Login

//POST Surveys



module.exports = router