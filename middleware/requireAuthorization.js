const jwt       = require('jsonwebtoken')
const {JWT_KEY} = require('../middleware/token')
const mongoose  = require('mongoose')
const User      = mongoose.model('User')

module.exports  = (req,res,next)=>{
    // GETTING HEADERS
    const {authorization}     = req.headers
    if(!authorization){
        return res.status(401).json({error : "You Must Be Login First"})
    }
    const token  = authorization.replace("Bearer ","")

    // TOKEN VERIFICATION
    jwt.verify(token,JWT_KEY,(err,payload)=>{
        if(err){
            return res.status(401).json({err: "You Must Be Login First"})
        }
        const {_id}  = payload
        User.findById(_id).then(userData=>{
            req.user = userData
            next()
        })
    })
}