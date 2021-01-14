const mongoose = require('mongoose')


const attendanceschema = new mongoose.Schema({

    IF_ID:{
        type: String,
        required:true
    },
    
    Name: {
        type: String,
        required: true
    },
    WorkHour: {
        type: Number,
        required: true,
       
    },
     Shift: {
        type: Number,
        required: true,
       
    },
    TotalAttendance: {
        type: Number,
        required: true,
        
    },
    Status:{
        type: Boolean,
        required : true,
        default : false
    }

})

module.exports = mongoose.model('Attendance',attendanceschema)