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
const crypto = require('crypto')
const { db } = require('../models/question.js')

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
const fillInSurvey = pug.compileFile('./templates/answer_survey.pug')
const allSurveysPage = pug.compileFile('./templates/all_surveys.pug')

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
    if (!req.session.username) {
        res.send(loginPage({
            message: "You have to be logged in to post a survey"
        }))
        return
    }
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
    console.log(req.session.userId)

    const survey = new Survey({
        title: req.session.survey_title,
        description: req.session.survey_description,
        questions: all_questions_obj,
        owner: req.session.userId
    })


    try{
        let insertedSurvey = await survey.save()
        res.send("")
    }catch(err){
        res.status(500).json({message: err.message})
    }

})

//POST Register
router.post('/register', async (req, res) => {

    hash = crypto.createHash("sha256")
    hash.update(req.body.password)
    hashedPassword = hash.digest('hex')
    const userToInsert = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })
    try{
        let existingUser = await User.find({username: userToInsert.username})
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
router.post('/login', async (req, res) => {
    insertedUsername = req.body.username
    insertedPassword = req.body.password

    hash = crypto.createHash('sha256')
    hash.update(insertedPassword)
    hashedPassword = hash.digest('hex')

    try {
        let usernameCheck = await User.find({username: insertedUsername})
        
        if (!usernameCheck){
            res.status(400).json("User doesn't exist")
            return
        }
        dbPassword = usernameCheck[0].password
        
        if (dbPassword != hashedPassword){
            res.status(400).send("Wrong password")
            return
        }
        req.session.username = usernameCheck[0].username
        req.session.userId = usernameCheck[0]._id
        console.log(req.session)
        res.send(homePage({
            username: req.session.username,
            user_id: req.session.userId
        }))
        return

    } catch(err){
        res.status(500).json({message: err.message})
        return
    }

})

//GET Logout
router.get('/logout', (req, res) => {
    req.session.destroy()
    res.send(homePage())
})

//GET All surveys
router.get('/all_surveys', async (req, res) => {
    try{
        let allSurveys = await Survey.find()
        console.log(allSurveys)
        res.send(allSurveysPage({
            username: req.session.username,
            user_id: req.session.userId,
            all_surveys: allSurveys
        }))
    } catch(err) {
        res.status(500).json({message: err.message})
    }
    
})

//GET Single survey
router.get('/survey', async (req, res) => {
    surveyId = req.query.id
    console.log("ID " + surveyId)
    // try {
    let thisSurvey = await Survey.find({_id: surveyId})
    console.log("Survey " + thisSurvey)
    res.send(fillInSurvey({
        survey: thisSurvey[0]
    }))
    // } catch(err) {
    //     res.status(500).json({message: err.message})
    // }
})

module.exports = router