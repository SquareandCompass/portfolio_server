const bcrypt = require('bcrypt');
const { ValCode } = require('../models');
const nodemailer = require('nodemailer');

const passwordChange = async (user,oldPass,newPass) => {
    let change;
    if(newPass) {
        change = newPass ? await bcrypt.compare(oldPass,user.password) : null;
    }
};

const verifyCode = async (email, user) => {
    const createCode = `${user.lastName}${user.emailList.length}${user.firstName}${Date.now()}`;

    let url = `${process.env.URL}/reset-password/${email}/${createCode}`;

    const emailCode = new ValCode({
        email, code: createCode,
        url,
        ownerId: user._id
    }).save();

    let subject = "Portfolio Password Reset";
    let msg = "Click the link to reset your password."

    //TODO: Need to build out the email notification.
}

module.exports = {
    passwordChange
}