const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const multer = require('multer')
const Attendance = require('../models/Attendance')
const excelToJson = require('convert-excel-to-json');
const requireAuthorization = require("../middleware/requireAuthorization")

global.__basedir = __dirname;


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'attendanceUpload/');
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname + "-" + Date.now() + "-" + file.originalname);
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

router.get('/',requireAuthorization,async(req,res)=>{
    try{
        const getSalary  = await Attendance.find()
        res.json(getSalary)
    }
    catch(e){
        res.send("error")
    }
})

router.post('/',requireAuthorization,upload.single("uploadfile"),(req,res)=>{

    const month = req.body.month
    const filePath  = 'attendanceUpload/'+req.file.filename
    const extractData  = excelToJson({
        
        sourceFile: filePath,
        sheets:[{
            // Excel Sheet Name
            name: month,
 
            // Header Row -> be skipped and will not be present at our result object.
            header:{
               rows: 1
            },
      
            // Mapping columns to keys
            columnToKey: {
                B: 'IF_ID',
                C: 'Name',
                D: 'WorkHour',
                E: 'Shift',
                F: 'TotalAttendance'
            }
        }]
    })
    // console.log(extractData)

    //Deleting Existing Data
    Attendance.deleteMany({}).then((result)=>{
        // res.json({msg : "msg"})
    })
    .catch(err=>{
        res.status(422).json({err: err})
    })


    Attendance.insertMany(extractData.September).then((result)=>{
        res.json({msg: "Data Imported"})
    })
    .catch(err=>{
        res.status(422).json({err : err})
    })

})

router.patch('/:id',requireAuthorization,getData, async(req,res)=>{

    const {Shift} = req.body
    if(!Shift || isNaN(Shift)){
        return res.status(422).json({ error : "Please Enter A Valid Value"})
    } 
    res.data.Shift = Shift
    res.data.TotalAttendance = Shift
    res.data.WorkHour = Shift * 7.5
    

    try{
        const updateAttendance = await res.data.save()
        res.json(res.data)
    }
    catch(e){
        res.status(500).json({msg : e.msg})
    }
})


// fetch by ID
async function getData(req,res,next){
    let data
    try{
        data    = await Attendance.findById(req.params.id)
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