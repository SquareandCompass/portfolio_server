const mongoose = require('mongoose');

const Employment = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    currentlyWorking: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duties: [String],
    yearlyPay: Number,
    visible: {
        type: Boolean,
        default: true
    },
    avatar: String
});

module.exports = mongoose.model('employers', Employment);