const mongoose = require('mongoose');

const Project = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    repoLink: {
        type: String,
        unique: true
    },
    deployedLink: {
        type: String,
        unique: true
    },
    details: String
});

module.exports = mongoose.model('project', Project);