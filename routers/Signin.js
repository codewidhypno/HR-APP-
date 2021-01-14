const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const User = require('../models/authUser')
const {JWT_KEY} = require('../middleware/token')


router.post('/', (req,res)=>{
    const {email,password} = req.body

    if(!email || !password){
        return res.status(422).json({msg : "Please Enter Email and Password"})
    }
    User.findOne({MailId : email})
    .then(authuser=>{
        if(!authuser){
            return res.status(422).json({msg: "Invalid Email or Password"})
        }
        bcrypt.compare(password,authuser.Password)
        .then(authorized=>{
            if(authorized){
                const token  = jwt.sign({_id : authuser._id},JWT_KEY)
                res.json({token})
            }
            else{
                return res.status(422).json({msg: "Invalid Email or Password"})
            }
        })
    })
})

module.exports = router