const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const pug = require('pug')
const session = require('express-session')
const bodyParser = require('body-parser')
const User  = require('../models/survey.js')

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
    console.log(survey_title)
    res.send(makeASurvey({
        title: survey_title
    }))

})

router.post('/save-survey', (req, res) => {
    survey = req.body
    console.log(survey)
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
            res.send("je")
            return
        }
        else{
            newInsert = await userToInsert.save()
            res.send('Jea')
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