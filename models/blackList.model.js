const mongoose = require('mongoose');

const BlackList = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    warnings: {
        type: Number,
        required: true,
        default: 1,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
    },
    warningDates: {
        type: [Date]
    }
});

module.exports = mongoose.model('black-list', BlackList);