var express = require('express');
var app = express();
var pug = require('pug');
var bodyParser = require('body-parser');
var mysql = require('mysql')
const crypto = require('crypto');
const session = require('express-session');
var cookieParser = require('cookie-parser');
const { type } = require('os');

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

var db = mysql.createConnection({
    database: "jsurvey_db",
    host : "localhost",
    user : "root",
    password : ""
})

db.connect((err) => {
    if (err) console.log(err);
    console.log("Connected to database")
})

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
    console.log(req.session)
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

app.post('/login', (req, resp) => {

    username = req.body.username
    password = req.body.password    
    
    hash = crypto.createHash("sha256")
    hash.update(password)
    hashed_pass = hash.digest("hex")

    sql = "SELECT * FROM user WHERE username = ?"
    db.query(sql, [username], (err, res) => {
        if (err) throw err;

        if (res.length > 0) {
            if (hashed_pass == res[0].password){
                
                req.session.username = res[0].username
                req.session.user_id = res[0].user_id 
                console.log(res[0].user_id)
                console.log("User id iz /login: " + res[0].user_id)
                resp.send(CompiledIndex({
                    user: req.session.username,
                    user_id: req.session.user_id
                }))
            }

            else {
                resp.send(CompiledLogin({
                    user: req.session.username,
                    user_id: req.session.user_id,
                    error: "Wrong password"
                }))
            }
        } 
        
        else {
            resp.send(CompiledLogin({
                user: req.session.username,
                user_id: req.session.user_id,
                error: "Enter your credentials"
            }))
        }
    })

})

app.get('/register', (req, resp) => {
    resp.send(CompiledRegister({
        user: req.session.username,
        user_id: req.session.user_id
    }));
});

app.post('/register', (req, resp) => {
    username = req.body.username
    email = req.body.email
    password = req.body.password

    hash = crypto.createHash("sha256")
    hash.update(password)
    hashed_pass = hash.digest("hex")

    console.log(hashed_pass)

    sql = "INSERT INTO user VALUES (null, ?, ?, ?)"

    db.query(sql, [email, username, hashed_pass], (err, res) => {
        if (err) throw err;
        resp.redirect('/login')
    })
})

app.get('/logout', (req, resp) => {
    req.session.destroy()
    resp.redirect('/login')
})

app.get('/make-a-survey', (req, resp) => {
    resp.send(CompiledAddSurveyName({
        user: req.session.username,
        user_id: req.session.user_id
    }))
})

app.post('/proceed_to_survey', (req, resp) => {
    
    survey_name = req.body['survey-name']
    survey_description = req.body['survey-description']

    req.session["survey_name"] = survey_name
    req.session["survey_description"] = survey_description

    resp.send(CompiledMakeASurvey({
        title: survey_name,
        description: survey_description
    }))
})

app.post('/save-survey', (req, resp) => {
    questions = req.body.question
    console.log(questions)
    
})


// app.get('/make-a-survey', (req, resp) => {
//     console.log("\n\n\n" + req.session.user_id + "\n\n\n")
//     if (typeof req.session.user_id == 'undefined') {
//         console.log('jea')
//         resp.send(CompiledLogin({
//             error: "You have to be logged in to post your surveys"
//         }))
//         return
//     }
//     if (!req.session.cur_survey){
//         user_id = req.session.user_id,        
//         sql = "INSERT INTO survey VALUES(null, ?, ?, ?)"        
//         date = new Date()    

//         db.query(sql, [user_id, date, "JSurvey"], (err, res) => {
//             if(err) throw err;
//             req.session.cur_survey = res['insertId']
//             survey_id = res['insertId']
//             sql = `
//                 SELECT * 
//                 FROM question            
//                 WHERE question.survey_id=?
//             `
//             db.query(sql, [survey_id], (err, res) => {
//                 if (err) throw err;                
//                 q_list = []
//                 q_list.push(res)
//                 resp.send(CompiledMakeASurvey({
//                     questions: q_list,
//                     user: req.session.username,
//                     user_id: req.session.user_id
//                 }))
//             })
//             // resp.send(CompiledMakeASurvey())
//         })
//     }
//     else {
//         survey_id = req.session.cur_survey
//             sql = `
//                 SELECT * 
//                 FROM question               
//                 WHERE question.survey_id=?
//             `
//             db.query(sql, [survey_id], (err, res) => {
//                 if (err) throw err;                
//                 resp.send(CompiledMakeASurvey({
//                     user: req.session.username,
//                     user_id: req.session.user_id,
//                     questions: res
//                 }))
//             })
//     }
// })

// app.post('/add_question', (req, resp) => {    
    // console.log(req.body)
    // user_id_session = req.session.user_id
    // survey_id = req.session.cur_survey
    // question_text = req.body['question-text'];
    // var question_type, answer_options;
    // if ("radio-option" in req.body){
    //     answer_options = req.body['radio-option'];
    //     question_type = "radio"
    // }
    // if ("checkbox-option" in req.body){
    //     question_type = "checkbox"
    //     answer_options = req.body['checkbox-option'];
    // }   
    // console.log(req.body)
    // sql = `
    //     INSERT INTO question VALUES(null, ?, ?, ?)
    // `
    // console.log(survey_id,question_text, question_type)
    // db.query(sql, [survey_id,question_text,question_type], (err, res) => {
    //     if (err) throw err;
        
    //     question_id = res['insertId']
    //     sql = "INSERT INTO answer VALUES (null, ?, ?)"
        
    //     answer_options_list = []
    //     if(typeof answer_options == 'string' || answer_options instanceof String) {
    //         answer_options_list.push(answer_options)
    //     }
    //     else {
    //         answer_options_list = answer_options
    //     }
        
        
    //     for (const answer of answer_options_list) {
    //         db.query(sql, [question_id, answer], (err, result) => {
    //             if (err) throw err;                
    //         })
    //     }
    //     resp.redirect('/make-a-survey')
    // })   
// })

app.listen(process.env.PORT || 5000, () => console.log("App is being served on: http://localhost:5000"));