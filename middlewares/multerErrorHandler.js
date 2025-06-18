const multer = require("multer")


function multerErrorHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    } else if (err) {
        return res.status(400).json({ message: err.message || "File upload error" });
    }
    next(); 
}


module.exports = multerErrorHandler