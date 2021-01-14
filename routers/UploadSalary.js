const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const multer = require('multer')
const Salary = require('../models/PaySalary')
const excelToJson = require('convert-excel-to-json');
const requireAuthorization = require("../middleware/requireAuthorization")

global.__basedir = __dirname;


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'SalaryUpload/');
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype === 'application/vnd.oasis.opendocument.spreadsheet'){
        cb(null,true)
    }
    else{
        cb(new Error("Inappropriate File Type"),false)
       
    }
};

const upload  = multer({storage : storage,  sizelimit :{ fileSize: 1024*1024*5 },fileFilter:fileFilter                             
})

// VIEW ALL ROWS
router.get('/',requireAuthorization,async(req,res)=>{
    try{
        const getSalary  = await Salary.find()
        res.json(getSalary)
    }
    catch(e){
        res.send("error")
    }
})

//VIEW SINGLE EMPLOY RECORD
router.get('/:id',requireAuthorization, async(req,res)=>{
    try{
        const row = await Salary.findById(req.params.id)
        res.json(row)
    }
    catch(e){
        res.status(500).json({msg :  e.msg})
    }
})


// CONVERT EXCEL SHEET TO DB
router.post('/',requireAuthorization,upload.single("uploadfile"),(req,res)=>{
    const filePath  = 'SalaryUpload/'+req.file.filename
    const extractData  = excelToJson({
        
        sourceFile: filePath,
        sheets:[{
            // Excel Sheet Name
            name: 'Sheet1',
 
            // Header Row -> be skipped and will not be present at our result object.
            header:{
               rows: 1
            },
      
            // Mapping columns to keys
            columnToKey: {
                A: 'IF_ID',
                B: 'Overall_Salary',
                C: 'Adj_Amount',
                D: 'Total_Amount',
                E: 'ESI',
                F: 'TDS',
                G: 'Payable_Amount',
                H: 'Adj_Return',
                

            }
        }]
    })
    // console.log(extractData)
    //Deleting Existing Data
    Salary.deleteMany({}).then((result)=>{
        // res.json({msg : "msg"})
    })
    .catch(err=>{
        res.status(422).json({err: err})
    })


    Salary.insertMany(extractData.Sheet1).then((result)=>{
        res.json({msg: "Data Imported"})
    })
    .catch(err=>{
        res.status(422).json({err : err})
    })

})

// Verify by Employ
router.patch('/:id', requireAuthorization,getData,async(req,res)=>{
    res.data.Status = true
    try{
        const updateSalary  = await res.data.save()
        res.json(res.data)
    }
    catch(e){
        res.status(500).json({msg : e.msg})
    }
    
 })
 
 
 // fetch by IF_ID
 async function getData(req,res,next){
     let data
     try{
         data    = await Salary.findById(req.params.id)
         if(data == null){
             return res.status(404).json({msg : 'No Data Found'})
         }
     }
     catch(e){
         res.status(500).json({msg : e.msg})
     }
 
     res.data = data
     next()
 }

module.exports = router