const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const runMulter = async () => {
    return upload.single("avatar");

    // return upload.fields([
    //     {name: 'avatar', maxCount: 1},
    //     {name: "logo", maxCount: 1},
    //     // {name: "files", maxCount: 10} // placeholder for multi-files
    // ]);
    // next()
} 

module.exports = runMulter;

//TODO: Would like multer to be a separate function to call for the various files being handled.