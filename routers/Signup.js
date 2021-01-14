const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const multer = require('multer')
const User = require('../models/authUser')
const requireAuthorization = require("../middleware/requireAuthorization")


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'uploads/');
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null,true)
    }
    else{
        cb(new Error("Inappropriate File Type"),false)
       
    }
};

const upload  = multer({storage : storage,  sizelimit :{ fileSize: 1024*1024*5 },fileFilter:fileFilter                             
})

// Dummy fetch
router.get('/', async (req,res)=>{
    username  = req.user.IF_ID
   res.send("Welcome:"+" " + username)
})


//Registration
router.post('/', upload.fields([{name:'Photo',maxCount: 1},{name:'Signature',maxCount: 1}]), (req,res)=>{
    Photo       = req.files['Photo'][0].path
    Signature   = req.files['Signature'][0].path

    const {Name,IF_ID,JobRole,MailId,Password,confirmPassword,Doj,Contact,Address} = req.body
    const Status = false
    // user role = true is emp else admin
    const UserRole = true 
    const AlphaRegEx = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/
    const EmailRegEx = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
    const PhoneRegEx = /^\d{10}$/

    
   

    if(!Name || !JobRole || !MailId || !Password || !Doj || !Contact || !Address){
        return res.status(422).json({error : "Please Fill All Fields"})
    }
    if(Name.match(AlphaRegEx) == null){
        return res.status(422).json({ error : "Name Field Should Consist of Only Alphabets"})
    }
    if(MailId.match(EmailRegEx) == null){
        return res.status(422).json({ error : "Invalid Email Id"})
    }
    if(Contact.match(PhoneRegEx) == null){
        return res.status(422).json({ error : "Phone Number should be of 10 Digits"})
    }
    if(Password !== confirmPassword){
        return res.status(422).json({ error : "Password Mismatch"})
    }
    User.findOne({MailId : MailId}).then((fetchData)=>{
        if(fetchData){
            return res.status(422).json({error : "The Email Has Taken"})
        }
        
        bcrypt.hash(Password,12).then(hashedPassword=>{
                const newUser = new User({
                    Name,
                    IF_ID,
                    JobRole,
                    MailId,
                    Password : hashedPassword,
                    Doj,
                    Contact,
                    Address,
                    UserRole,
                    Photo,
                    Signature,
                    Status
                })
                newUser.save().then(newUser=>{
                    res.json("Resgistration Succesfull")
                })
                .catch(err=>{
                    console.log(err)
                })
        })
      
    })
    .catch(err=>{
        console.log(err)
    })
})


module.exports = router