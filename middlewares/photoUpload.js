const path = require("path")
const multer = require("multer")

// Photo Storage
const pphotoStorage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,path.join(__dirname,"../images"))
    },
    filename:function(req,file,cb){
        if(file){
            cb(null,new Date().toISOString().replace(/:/g,"-") + file.originalname)
        
        }else{
            cb(null,false)
        }
    }
})

// Photo Upload middleware
const photoUpload = multer({
    storage : pphotoStorage,
    fileFilter : function(req,file,cb){
        if(file.mimetype.startsWith("image")){
            cb(null,true) //true refer to start upload
        }else{
            cb({meassage:"Unsupported file format"},false)
        }
    },
    limits:{fileSize : 1024 * 1024  * 2} // max is 2 megabyte
})

module.exports = photoUpload