var express = require('express');
var app = express();
var pug = require('pug');
var bodyParser = require('body-parser');

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

app.listen(process.env.PORT || 5000, () => console.log("Aplikacija se izvrsava na http://localhost:5000"));