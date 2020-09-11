const multer = require('multer');
const path = require("path");

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, "..", "..", "files"),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname) //browsr API that handles file
            const name = path.basename(file.originalname, ext) // We keep filename and extenson as original

            cb(null, `${name.replace(/\s/g, "")}-${Date.now()}${ext}`) // String interpolation. First replace method will take a REGEX expression to take out space
            //replace spaces and return without space and carry with date and extension
        }

    })
}