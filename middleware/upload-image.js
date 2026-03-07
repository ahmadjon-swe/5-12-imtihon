const multer =require("multer")
const fs =require("fs")
const path =require("path")
const {v4} = require("uuid")

const imageStorage = (folder)=>multer.diskStorage({
  destination: (req, file, cb) => {
    const existFolder = "uploads/images/"+folder
    if(!fs.existsSync(existFolder)) fs.mkdirSync(existFolder, { recursive: true })
    
    cb(null, existFolder)
  },
  filename: (req, file, cb)=>{
    const suffex = file.fieldname + "_" + v4()
    const ext = path.extname(file.originalname)

    cb(null, suffex+ext)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp|gif/

  const chekTypes = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const checkMimetype = file.mimetype.toLowerCase().startsWith("image/")

  if(checkMimetype && chekTypes){
    cb(null, true)
  }else{
    cb(new Error("only image files are allowed"))
  }
}

const uploadCategoryImage = multer({
  storage: imageStorage("categories"),
  limits: {fileSize: 1024 * 1024 * 20},
  fileFilter
})

const uploadCarImage = multer({
  storage: imageStorage("cars"),
  limits: {fileSize: 1024 * 1024 * 20},
  fileFilter
})

module.exports = {uploadCategoryImage, uploadCarImage}