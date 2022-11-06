const multer = require('multer')
const path = require('path')
const uuid = require('uuid')

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './uploads')
    },
    filename: (req, file, cb, filename) =>{
        cb(null, uuid.v4() + path.extname(file.originalname))
    }
})


module.exports = {
    storage
}