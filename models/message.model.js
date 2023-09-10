const mongoose = require('mongoose');

const Message = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    dateCreated: {
        type: String,
        required: true,
        default: new Date()
    },
    dateUpdated: Date,
    resolved: {
        type: Boolean,
        default: false
    },
    from: {
        type: mongoose.Types.ObjectId,
        ref: 'email'
    }
});

module.exports = mongoose.model('message', Message);