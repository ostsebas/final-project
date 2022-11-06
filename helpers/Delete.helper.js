const fs = require('fs')
const sharp = require('sharp')

const delImage = async (path) => {
    try {
        if(fs.existsSync(path)){
            fs.unlinkSync(path)
        }
    } catch (error) {
        console.log(error)
    }
}

const resizeImg = (filePath, route, fileName, size = 128) => {
    return sharp(filePath)
            .resize(size)
            .toFile(`./uploads/${route}/${fileName}`)
}

module.exports = {
    delImage,
    resizeImg
}