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
    bio: String,
},{
    virtuals: {
        fullName: { //NOTE: Testing
            get() {
                return `${this.firstName} ${this.lastName}`
            }
        },
        socials: { //NOTE: Not tested
            get() {
                let arr = [];
                
                const addToArr = (social) => social ? arr.push(social) : null;
                addToArr(this.facebook);
                addToArr(this.twitter);
                addToArr(this.gitHub);
                addToArr(this.linkedIn);
                addToArr(this.instagram);

                return arr;
            }
        }
    }    
});

// User.virtual('fullName').get(() => `${this.firstName} ${this.lastName}`);

module.exports = mongoose.model('user', User);