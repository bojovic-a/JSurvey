var express = require('express')
var app = express()
var pug = require('pug')
var bodyParser = require('body-parser')

app.use(express.static('./static'));
app.use(bodyParser.urlencoded({
    extended: true
}));

var CompiledBase = pug.compileFile('./templates/base.pug')
var CompiledIndex = pug.compileFile('./templates/index.pug')

app.get('/', (req, resp) => {
    resp.send(CompiledIndex())
})

app.listen(process.env.PORT || 5000, () => console.log("Aplikacija se izvrsava na http://localhost:5000"))