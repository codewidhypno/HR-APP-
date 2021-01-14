const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const multer = require('multer')
const Payable = require('../models/Payable')
const excelToJson = require('convert-excel-to-json');
const requireAuthorization = require("../middleware/requireAuthorization")

global.__basedir = __dirname;


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'payableUpload/');
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

// VIEW ALL EMPLOY PAYABLE DETAILS
router.get('/',requireAuthorization,async(req,res)=>{
    try{
        const getPay  = await Payable.find()
        res.json(getPay)
    }
    catch(e){
        res.send("error")
    }
})

//VIEW SINGLE EMPLOY RECORD
router.get('/:id', async(req,res)=>{
    try{
        const row = await Payable.findById(req.params.id)
        res.json(row)
    }
    catch(e){
        res.status(500).json({msg :  e.msg})
    }
})


// CONVERT EXCEL SHEET TO DB
router.post('/',requireAuthorization,upload.single("uploadfile"),(req,res)=>{
    const filePath  = 'payableUpload/'+req.file.filename
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
                B: 'Grade_base_pay',
                C: 'Salary',
                D: 'Tr_fee',
                E: 'Bonus',
                F: 'ns',
                G: 'Rent',
                H: 'TotalSalary'

            }
        }]
    })
    // console.log(extractData)

    //Deleting Existing Data
    Payable.deleteMany({}).then((result)=>{
        // res.json({msg : "msg"})
    })
    .catch(err=>{
        res.status(422).json({err: err})
    })


    Payable.insertMany(extractData.Sheet1).then((result)=>{
        res.json({msg: "Data Imported"})
    })
    .catch(err=>{
        res.status(422).json({err : err})
    })

})

// Verify by Employ
router.patch('/:IF_ID',requireAuthorization, getData,async(req,res)=>{
   res.data.Status = true
   try{
       const updatePayable  = await res.data.save()
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
        data    = await Payable.findOne({'IF_ID' : req.params.IF_ID})
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