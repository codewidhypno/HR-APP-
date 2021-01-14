const express = require('express')
const router = express.Router()
const User = require('../models/authUser')
const CorrectionRequest = require('../models/attendanceCorrectionRequests')
const requireAuthorization = require("../middleware/requireAuthorization")
const { request } = require('express')

router.post('/', requireAuthorization,requireAuthorization,(req,res)=>{
    const{no_day} = req.body
    if(!no_day || isNaN(no_day)){
        return res.status(422).json({ error : "Please Enter A Valid Value"})
    }
    const if_id = req.user.IF_ID
    const newRequest = new CorrectionRequest({
        IF_ID : if_id,
        no_day
    })
    newRequest.save().then(newRequest=>{
        res.json("Correction Request Send")
    })
    .catch(err=>{
        res.status(422).json(err)
    })
} )

//view all correction requets
router.get('/', requireAuthorization,requireAuthorization, async(req,res)=>{
    const temp = req.user.Name
    console.log(temp)
    try{
        const requestSet  = await CorrectionRequest.find()
        res.json(requestSet)
    }
    catch(e){
        res.send("error")
    }
})

// get by IF_ID
router.get('/:IF_ID', requireAuthorization,getRequest, requireAuthorization,(req,res)=>{
    res.json(res.CorrectionReq)

})

// MIDDLEWARE - GET BY IF_ID 
async function getRequest(req,res,next){
    let contact
    try{
        CorrectionReq = await CorrectionRequest.findOne({'IF_ID' : req.params.IF_ID})
        if(CorrectionReq == null){
           return res.status(404).json({ message:'Unable to find record' })
        }
    }
    catch(e){
        res.status(500).json({message : err.message})
    }

    res.CorrectionReq = CorrectionReq
    next()
}


module.exports = router