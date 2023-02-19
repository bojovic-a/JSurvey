const express = require('express');
const app = express();
const pug = require('pug');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { type } = require('os');
const mongoose = require("mongoose")
require('dotenv').config()

const uri = process.env.DATABASE_URL

mongoose.connect(uri)
const db = mongoose.connection

db.on("error", (error) => console.log(error))
db.once("open", ()=>console.log("Jes"))

app.use(express.json())

const jsurveyRouter = require('./routes/jsurvey.js')
app.use('/jsurvey', jsurveyRouter)

app.listen(process.env.PORT || 3000, () => console.log("App is being served on: http://localhost:5000"));