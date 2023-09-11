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
    archive: {
        type: Boolean,
        default: false
    },
    from: {
        type: mongoose.Types.ObjectId,
        ref: 'email'
    },
    adminNotes: String,
    files: [String],
    links: [String]
},{
    virtuals: {
        pastDue: {
            // get() {
            // }
            //NOTE: Need to set a method that checks how long the message has been in the database. If it past 30 days and unresolved, should consider if it is kept (denoted by admin), then it will auto delete these messages.
        },
    }
});



module.exports = mongoose.model('message', Message);