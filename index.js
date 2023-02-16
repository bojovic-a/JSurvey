const express = require('express');
const app = express();
const pug = require('pug');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { type } = require('os');
const mongoose = require("mongoose")

mongoose.set("strictQuery", false)
mongoose.connect("mongodb://localhost:5000/jsurvey_db")

app.use(cookieParser());

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

app.use(session({
    secret: 'VERY_HARD_TO_CRACK_KEY',
    resave: false,
    saveUninitialized: true
}))

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json())

app.use(express.static('./static'));

app.use(bodyParser.urlencoded({
    extended: true
}));

var CompiledBase = pug.compileFile('./templates/base.pug');
var CompiledIndex = pug.compileFile('./templates/index.pug');
var CompiledLogin = pug.compileFile('./templates/login.pug');
var CompiledRegister = pug.compileFile('./templates/register.pug');
var CompiledMakeASurvey = pug.compileFile('./templates/make_a_survey.pug');
var CompiledAddSurveyName = pug.compileFile('./templates/add_survey_name.pug')


app.get('/', (req, resp) => {    
    resp.send(CompiledIndex({
        user: req.session.username,
        user_id: req.session.user_id
    }));             
});

app.get('/login', (req, resp) => {
    resp.send(CompiledLogin({
        user: req.session.username,
        user_id: req.session.user_id
    }));
});

// app.post('/login', (req, resp) => {

//     username = req.body.username
//     password = req.body.password    
    
//     hash = crypto.createHash("sha256")
//     hash.update(password)
//     hashed_pass = hash.digest("hex")

//     sql = "SELECT * FROM user WHERE username = ?"
//     db.query(sql, [username], (err, res) => {
//         if (err) throw err;

//         if (res.length > 0) {
//             if (hashed_pass == res[0].password){
                
//                 req.session.username = res[0].username
//                 req.session.user_id = res[0].user_id 
//                 console.log(res[0].user_id)
//                 console.log("User id iz /login: " + res[0].user_id)
//                 resp.send(CompiledIndex({
//                     user: req.session.username,
//                     user_id: req.session.user_id
//                 }))
//             }

//             else {
//                 resp.send(CompiledLogin({
//                     user: req.session.username,
//                     user_id: req.session.user_id,
//                     error: "Wrong password"
//                 }))
//             }
//         } 
        
//         else {
//             resp.send(CompiledLogin({
//                 user: req.session.username,
//                 user_id: req.session.user_id,
//                 error: "Enter your credentials"
//             }))
//         }
//     })

// })

app.get('/register', (req, resp) => {
    resp.send(CompiledRegister({
        user: req.session.username,
        user_id: req.session.user_id
    }));
});

// app.post('/register', (req, resp) => {
//     username = req.body.username
//     email = req.body.email
//     password = req.body.password

//     hash = crypto.createHash("sha256")
//     hash.update(password)
//     hashed_pass = hash.digest("hex")

//     existing_user = getUserByUsername(username)
//     console.log(existing_user)
//     if (existing_user) {
//         resp.send(CompiledRegister({
//             user: req.session.username,
//             user_id: req.session.user_id,
//             error: "User already exists"
//         }))
//         return
//     }

//     console.log(hashed_pass)
//     newUser = {
//         username: username,
//         email: email,
//         password: hashed_pass
//     }
//     insertUser(newUser)
//     resp.redirect('/')

// })

app.get('/logout', (req, resp) => {
    req.session.destroy()
    resp.redirect('/login')
})

app.get('/make-a-survey', (req, resp) => {
    // if (!req.session.username) {
    //     resp.redirect('/login')
    //     return
    // }
    resp.send(CompiledAddSurveyName({
        user: req.session.username,
        user_id: req.session.user_id
    }))
})

// app.post('/proceed_to_survey', (req, resp) => {
    
//     survey_name = req.body['survey-name']
//     survey_description = req.body['survey-description']

//     req.session["survey_name"] = survey_name
//     req.session["survey_description"] = survey_description

//     resp.send(CompiledMakeASurvey({
//         title: survey_name,
//         description: survey_description
//     }))
// })

// app.post('/save-survey', (req, resp) => {
//     questions = req.body.all_questions    
//     title = req.session.survey_name
//     description = req.session.survey_description
//     console.log(title, description, questions)

// })


app.listen(process.env.PORT || 5000, () => console.log("App is being served on: http://localhost:5000"));