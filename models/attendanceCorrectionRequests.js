const mongoose  = require('mongoose')
const {ObjectId}        = mongoose.Schema.Types

const correctionSchema = new mongoose.Schema({
   
   IF_ID:{
       type: String,
       required : true
   },
   no_day:{
       type : Number,
       required: true
   }
})

module.exports  = mongoose.model('CorrectionRequests', correctionSchema)