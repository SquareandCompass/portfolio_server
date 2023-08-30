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

    },
    from: {
        type: mongoose.Types.ObjectId,
        ref: 'emailList'
    }
});

module.exports = mongoose.model('message', Message);