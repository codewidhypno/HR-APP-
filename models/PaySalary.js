const mongoose  = require('mongoose')
const SalarySchema = new mongoose.Schema({
    IF_ID:{
        type : String,
        required :true
    },
    Overall_Salary:{
        type: Number,
        required : true
    },
    Adj_Amount:{
        type : Number,
        required : true
    },
    Total_Amount:{
        type: Number,
        required : true
    },
    ESI:{
        type: Number,
        required : true
    },
    TDS:{
        type : Number,
        required : true
    },
    Payable_Amount:{
        type: Number,
        required : true
    },
    Adj_Return:{
        type: Number,
        required : true
    },
    Status:{
        type: Boolean,
        default : false,
        required : true
    }
})

module.exports = mongoose.model('PaySalary', SalarySchema)