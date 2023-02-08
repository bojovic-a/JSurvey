var express = require('express');
var app = express();
var pug = require('pug');
var bodyParser = require('body-parser');
var mysql = require('mysql')

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
    resp.send(CompiledIndex());
});

app.get('/login', (req, resp) => {
    resp.send(CompiledLogin());
});

app.get('/register', (req, resp) => {
    resp.send(CompiledRegister());
});

app.get('/make-a-survey', (req, resp) => {
    resp.send(CompiledMakeASurvey());
});

app.post('/add_question', (req, resp) => {
    console.log(req.body)
    question_text = req.body['question-text'];
    if ("radio-option" in req.body){
        answer_options = req.body['radio-option'];
    }
    if ("checkbox-option" in req.body){
        answer_options = req.body.radio['checkbox-option'];
    }

    user_id = 1      
    let date = new Date() 
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    
    let current_date_format = `${day}-${month}-${year}`;

    sql = `
        CALL spInsertSurvey(null, ?, ?)        
    `
    db.query(sql, [user_id, current_date_format], (err, res) => {
        if(err) throw err;
        console.log("Uspesno dodato" + result)
        resp.redirect("/make-a-survey")
    })
    
    
    // NEKAKO RESI DODAVANJE ANKETE, PITANJA I ODGOVORA ODJEDNOM
    

})

app.listen(process.env.PORT || 5000, () => console.log("App is being served on: http://localhost:5000"));