const mongoose = require('mongoose');

const Email = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    messages: [String],
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
    },
    title: {
        type: String,
    },
    notes: String
},{
    virtuals: {
        fullName: {
            get() {
                return `${this.firstName} ${this.lastName}`
            }
        },
    }
});

module.exports = mongoose.model('email', Email);