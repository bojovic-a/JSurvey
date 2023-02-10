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

app.get('/', (req, resp) => {
    console.log(req.session)
    resp.send(CompiledIndex({
        user: req.session.username
    }));             
});

app.get('/login', (req, resp) => {
    resp.send(CompiledLogin({
        user: req.session.username
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
                resp.send(CompiledIndex({
                    user: req.session.username
                }))
            }

            else {
                resp.send(CompiledLogin({
                    user: req.session.username,
                    error: "Wrong password"
                }))
            }
        } 
        
        else {
            resp.send(CompiledLogin({
                user: req.session.username,
                error: "Enter your credentials"
            }))
        }
    })

})

app.get('/register', (req, resp) => {
    resp.send(CompiledRegister({
        user: req.session.username
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
    if (!req.session.user_id) {
        resp.send(CompiledLogin({
            user: req.session.username,
            error: "You have to be logged in to post surveys"
        }))
    }
    if (!req.session.cur_survey){
        user_id = req.session.user_id
        sql = "INSERT INTO survey VALUES(null, ?, ?)"
        console.log(user_id)
        date = new Date()    

        db.query(sql, [user_id, date], (err, res) => {
            if(err) throw err;
            req.session.cur_survey = res['insertId']
            survey_id = res['insertId']
            sql = `
                SELECT * 
                FROM question            
                WHERE question.survey_id=?
            `
            db.query(sql, [survey_id], (err, res) => {
                if (err) throw err;
                console.log(res)
                q_list = []
                q_list.push(res)
                resp.send(CompiledMakeASurvey({
                    questions: q_list
                }))
            })
            // resp.send(CompiledMakeASurvey())
        })
    }
    else {
        survey_id = req.session.cur_survey
            sql = `
                SELECT * 
                FROM question            
                WHERE question.survey_id=?
            `
            db.query(sql, [survey_id], (err, res) => {
                if (err) throw err;
                console.log(res)
                resp.send(CompiledMakeASurvey({
                    questions: res
                }))
            })
    }
})

app.post('/add_question', (req, resp) => {    

    user_id_session = req.session.user_id
    survey_id = req.session.cur_survey
    question_text = req.body['question-text'];
    var question_type, answer_options;
    if ("radio-option" in req.body){
        answer_options = req.body['radio-option'];
        question_type = "radio"
    }
    if ("checkbox-option" in req.body){
        question_type = "checkbox"
        answer_options = req.body.radio['checkbox-option'];
    }   
    console.log(req.body)
    sql = `
        INSERT INTO question VALUES(null, ?, ?, ?)
    `
    console.log(survey_id,question_text, question_type)
    db.query(sql, [survey_id,question_text,question_type], (err, res) => {
        if (err) throw err;
        
        question_id = res['insertId']
        sql = "INSERT INTO answer VALUES (null, ?, ?)"
        
        answer_options_list = []
        if(typeof answer_options == 'string' || answer_options instanceof String) {
            answer_options_list.push(answer_options)
        }
        else {
            answer_options_list = answer_options
        }
        
        
        for (const answer of answer_options_list) {
            db.query(sql, [question_id, answer], (err, result) => {
                if (err) throw err;                
            })
        }
        resp.redirect('/make-a-survey')
    })    
    

})

app.listen(process.env.PORT || 5000, () => console.log("App is being served on: http://localhost:5000"));