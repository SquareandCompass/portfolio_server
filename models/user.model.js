const mongoose = require('mongoose');

// This is meant to be the admin 
const User = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true
    },
    backupEmail: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    emailList: {
        type: [Object],
        required: true
    },
    projects: {
        type: [Object],
        required: true
    },
    employment: {
        type: [Object],
        required: true
    },
    facebook: String,
    twitter: String,
    gitHub: String,
    linkedIn: String,
    instagram: String,
    avatar: String,
    logo: String,
});

module.exports = mongoose.model('user', User);