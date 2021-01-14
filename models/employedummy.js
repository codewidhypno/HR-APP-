const mongoose = require('mongoose')


const salaryschema = new mongoose.Schema({

    Id:{
        type: String,
        required:true
    },
    
    Name: {
        type: String,
        required: true
    },
    Department: {
        type: String,
        required: true,
       
    },
     Attendance: {
        type: String,
        required: true,
       
    },
    Salary: {
        type: Number,
        required: true,
        
    }

})

module.exports = mongoose.model('Salary',salaryschema)