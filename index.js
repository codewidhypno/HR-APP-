const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost/hrapp'
const bodyParser = require('body-parser')


const app = express()
//VGMcd4d8w3rt5rHV
mongoose.connect(url, {useNewUrlParser:true,useUnifiedTopology: true})
const con = mongoose.connection

con.on('open', () => {
    console.log('connected...')
})

app.use(express.json())

const signup            = require('./routers/Signup')
const signin            = require('./routers/Signin')
const uploadattendance  = require('./routers/UploadAttendance')
const correctionrequest = require('./routers/initiateCorrectionRequest')
const uploadPayable     = require('./routers/UploadPayable')
const uploadsalary      =  require('./routers/UploadSalary')

app.use('/Signup',signup)
app.use('/Signin',signin)
app.use('/UploadAttendance',uploadattendance)
app.use('/CorrectionRequest',correctionrequest)
app.use('/UploadPayable', uploadPayable)
app.use('/UploadSalary',uploadsalary)

app.listen(9000, () => {
    console.log('Server started')
})
