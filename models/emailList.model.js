const mongoose = require('mongoose');

const EmailList = new mongoose.Schema({
    first: String,
    last: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    messages: [Object],
});
// set virtuals for full name and other aspects that may be useful.

module.exports = mongoose.model('emailList', EmailList);