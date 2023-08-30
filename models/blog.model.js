const mongoose = require('mongoose');

const Blog = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    tags: [String],
    publish: {
        type: Boolean,
        default: false
    },
    createDate: {
        type: Date,
        default: new Date()
    },
    updateDate: Date
});

module.exports = mongoose.model('blog', Blog);