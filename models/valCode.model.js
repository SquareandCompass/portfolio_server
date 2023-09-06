const mongoose = require('mongoose');

const ValidationCode = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        expires: 1200
    },
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }
});

module.exports = mongoose.model('validationCode', ValidationCode);