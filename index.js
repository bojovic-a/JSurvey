var express = require('express');
var app = express();
var pug = require('pug');
var bodyParser = require('body-parser');
var mysql = require('mysql')
const crypto = require('crypto');
const session = require('express-session');
var cookieParser = require('cookie-parser')

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
    console.log(session)
    resp.send(CompiledIndex());             
});

app.get('/login', (req, resp) => {
    resp.send(CompiledLogin());
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
                session.username = res[0].username
                session.user_id = res[0].user_id
                resp.send(CompiledIndex())
            }

            else {
                resp.send(CompiledLogin({
                    error: "Wrong password"
                }))
            }
        } 
        
        else {
            resp.send(CompiledLogin({
                error: "Enter your credentials"
            }))
        }
    })

})

app.get('/register', (req, resp) => {
    resp.send(CompiledRegister());
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

    if (!session.user_id) {
        resp.send(CompiledLogin({
            error: "You have to be logged in to post surveys"
        }))
    }

    user_id_session = session.user_id.toString()
    let date = new Date() 
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let current_date_format = `${day}-${month}-${year}`;

    sql = "INSERT INTO survey VALUES(null, ?, ?)"

    db.query(sql, [user_id_session, current_date_format], (err, res) => {
        if (err) throw err;

        resp.send(CompiledMakeASurvey());
    })    
});

app.post('/add_question', (req, resp) => {    
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
        
    
    sql = `
        INSERT INTO question VALUES(null, ?, ?, ?)
    `
    console.log(survey_id,question_text, question_type)
    db.query(sql, [survey_id,question_text,question_type], (err, res) => {
        if (err) throw err;
        
        question_id = res['insertId']
        sql = "INSERT INTO answer VALUES (null, ?, ?)"

        for (const answer of answer_options) {
            db.query(sql, [question_id, answer], (err, res) => {
                if (err) throw err;
                resp.send(CompiledMakeASurvey())
            })
        }
    })    
    

})

app.listen(process.env.PORT || 5000, () => console.log("App is being served on: http://localhost:5000"));