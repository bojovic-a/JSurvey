const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const pug = require('pug')
const session = require('express-session')
const bodyParser = require('body-parser')
const User  = require('../models/user.js')
const Question = require('../models/question.js')
const Survey = require('../models/survey.js')
const Answer = require('../models/answer.js')
const { json } = require('body-parser')
const crypto = require('crypto')
const { db } = require('../models/question.js')
const user = require('../models/user.js')
const { type } = require('os')

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
const infoPage = pug.compileFile('./templates/info_page.pug')
const userPage = pug.compileFile('./templates/user_profile.pug')
const updateUserPage = pug.compileFile('./templates/update_user.pug')
const changePasswordPage = pug.compileFile('./templates/change_password.pug')
const userSurveysPage = pug.compileFile('./templates/my_surveys.pug')
const editSurveyPage = pug.compileFile('./templates/edit_survey.pug')

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
    console.log(req.session)
    res.send(addSurveyName({
        username: req.session.username
    }))
})

//Render create survey
router.post('/proceed-to-survey', (req, res) => {
    survey_title = req.body['survey-name']
    survey_description = req.body['survey-description']

    req.session.survey_title = survey_title
    req.session.survey_description = survey_description
    
    res.send(makeASurvey({
        title: survey_title,
        username: req.session.username,
        userId: req.session.userId
    }))

})

//Save survey to MongoDB
router.post('/save-survey', async (req, res) => {
    console.log(req.body)
    questions = req.body
    
    all_questions_obj = []
    console.log(questions + "\n" + typeof questions)
    if (typeof questions == 'string') {
        all_questions_obj.push(questions)
    }
    else{
        for (const q of questions) {
            const question = new Question({
                title: q.title,
                type: q.type,
                answers: q.answers
            })
            all_questions_obj.push(question)
        }
    }

    const surveyToSave = new Survey({
        title: req.session.survey_title,
        description: req.session.survey_description,
        questions: all_questions_obj,
        owner: req.session.userId
    })
    console.log(surveyToSave)


    try{
        let insertedSurvey = await surveyToSave.save()
        res.status(200).json({message: "ALL GOOD"})

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
        password: hashedPassword,
        about: req.body.about
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
            res.send(infoPage({
                info_title: "Registration successful",                
                info_anchor: "Login",
                info_anchor_href: "/jsurvey/login"
            }))
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
    // try {
    let thisSurvey = await Survey.find({_id: surveyId})
    res.send(fillInSurvey({
        survey: thisSurvey[0],
        user_id: req.session.userId
    }))
    // } catch(err) {
    //     res.status(500).json({message: err.message})
    // }
})

//POST Answers
router.post('/save_form_data', async (req, res) => {
    all_answers = req.body.all_forms
    
    if (all_answers instanceof Array) {
        all_answers_list = all_answers
    }
    else{
        all_answers_list = []
        all_answers_list.push(all_answers)
    }
    
    for (const answer of all_answers_list) {        
        selected_answer_list = []
        for (const a of answer.answers){
            selected_answer_list.push(a)
        }
        let ans = new Answer({
            user_id: "1",
            answer: selected_answer_list,
            question_id: answer.question_id
        })

        try{
            let insertAnswer = await ans.save()
        } catch(err){
            res.status(500).json({message: err.message})
            return
        }
    }
})


//GET Info page after answering a survey
router.get('/thank_you_page', (req, res) => {
    res.send(infoPage({
        info_title: "It's all done",
        info_text: "Thank you for filling in this survey"
    }))
})


//GET Info page after adding a survey
router.get('/survey_saved', (req, res) => {
    res.send(infoPage({
        username: req.session.username,
        info_title: "Survey has been added successfully.",
        info_text: "You can view this survey on your profile page"
    }))
})

//GET User profile
router.get('/user_profile', async (req, res) => {

    if (!req.session.username) {
        res.send(loginPage({
            message: "Create your account"
        }))
        return
    }

    let userId = req.session.userId
    try{
        let userDb = await User.findOne({_id: userId}) 
    
        res.send(userPage({
            user: userDb,
            userId: userId
        }))
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//Render page for updating user info
router.get('/change-info', async (req, res) => {
    userId = req.query.id
    try{
        let userDb = await User.findOne({_id: userId})
        res.send(updateUserPage({
            user: userDb
        }))
    }   
    catch(err) {
        res.status(500).json({message: err.message})
    }
})

//Update user info in database
router.post('/change-info', async (req, res) => {
    userNow = req.body
    
    try {
        let userDb = await User.findOne({_id: userNow.userId})
        userDb.username = userNow.username
        userDb.email = userNow.email
        userDb.about = userNow.about
        let updateResult = await userDb.save()
        res.send(userPage({
            user: userDb
        }))
    } catch(err) {
        res.status(500).send(err.message)       
    }
})

//Render page for changing password
router.get('/change-password', (req, res) => {
    res.send(changePasswordPage())
})

//Change password in MongoDB
router.post('/change-password', async (req, res) => {
    oldPass = req.body.old_password;
    newPass = req.body.new_password;
    confirmPass = req.body.confirm_password;
    hash = crypto.createHash("sha256");
    hash.update(oldPass);
    hashedOldPassword = hash.digest('hex');

    try {
        let userDb = await User.findOne({_id: req.session.userId});
    
        if (userDb.password == hashedOldPassword) {
            if(newPass == confirmPass){
                hash = crypto.createHash("sha256");
                hash.update(newPass);
                hashedNewPassword = hash.digest('hex');
                userDb.password = hashedNewPassword;
                await userDb.save();
                res.redirect('/jsurvey/login');
                return
            }
            else {
                res.send(changePasswordPage({
                    message: "Passwords do not match"
                }))
            }
        }
        else {
            res.send(changePasswordPage({
                message: "Incorrect old password"
            }))
        }
        
    } catch(err) {
        res.status(500).send({message: err.message});
    } 
})

//Fetch all surveys for logged in user 
router.get('/user-surveys', async (req, res) => {
    userId = req.session.userId;
    try {
        let userSurveys = await Survey.find({owner: userId})
        res.send(userSurveysPage({
            all_surveys: userSurveys
        }))
        
    } catch(err) {
        res.status(500).send(infoPage({
            info_title: "Server error",
            info_text: err.message
        }))
    }
})

//TODO: Edit survey after posting
router.get('/edit-survey', async (req, res) => {
    surveyId = req.query.id
    console.log(surveyId)
    try {
        let surveyToEdit = await Survey.findOne({_id: surveyId})
        res.send(editSurveyPage({
            username: req.session.username,
            survey: surveyToEdit,
            user_id: req.session.userId
        }))
        return
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//Test route for info page
// router.get('/info_test', (req, res) => {
//     res.send(infoPage({
//         info_title: "Info title",
//         info_text: "Info text"
//     }))
// })

module.exports = router