const mongoose = require('mongoose');

const Email = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    messages: [Object],
    blogSub: {
        type: Boolean,
        default: false,
    },
    newsLetterSub: {
        type: Boolean,
        default: true
    },
    validated: {
        type: Boolean,
        default: false,
    },
    company: {
        type: String,
        default: "individual"
    }
});
// set virtuals for full name and other aspects that may be useful.

module.exports = mongoose.model('email', Email);