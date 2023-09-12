const mongoose = require('mongoose');

const Project = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    repoFrontEnd: {
        type: String,
        unique: true
    },
    repoBackEnd: {
        type: String,
        unique: true
    },
    url: {
        type: String,
        unique: true
    },
    details: String,
    logo: String,
    display: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    forCompany: {
        type: String,
        default: 'personal'
    },
    type: String
});

module.exports = mongoose.model('project', Project);