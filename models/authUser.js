const mongoose  = require('mongoose')

const authUSer = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    IF_ID:{
        type: String,
        required: true
    },
    JobRole:{
        type:String,
        required:true
    },
    MailId:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        requred:true
    },
    Doj:{
        type:Date ,
        required:true
    },
    Contact:{
        type:Number,
        required:true
    },
    Address:{
        type:String,
        required:true
    },
    UserRole:{
        type: Boolean,
        required :true
    },
    Photo:{
        type:String,
    },
    Signature:{
        type:String,
    },
    Status:{
        type:Boolean,
        default:false
    }
})

module.exports  = mongoose.model('User', authUSer)