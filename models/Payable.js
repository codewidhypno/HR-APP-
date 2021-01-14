const mongoose = require('mongoose')

const PayableSchema = new mongoose.Schema({
    IF_ID:{
        type: String,
        required : true
    },
    Grade_base_pay:{
        type : String,
        required:true
    },
    Salary:{
        type: Number,
        required: true
    },
    Tr_fee:{
        type: Number,
        required : true
    },
    Bonus:{
        type: Number,
        required : true
    },
    ns:{
        type: Number,
        required : true
    },
    Rent:{
        type: Number,
        required : true
    },
    TotalSalary:{
        type: Number,
        required : true
    },
    Status :{
        type: Boolean,
        default : false,
        required: true
    }
})

module.exports  = mongoose.model('Payable', PayableSchema)