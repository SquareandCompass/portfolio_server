const mongoose = require('mongoose');

const Education = new mongoose.Schema({
    institution: {
        type: String,
        required: true
    },
    website: String,
    start: Date,
    end: Date,
    fieldOfStudy: String,
    details: String,
    certs: [Strings] //storing file layout.
});


module.exports = mongoose.model('education', Education);