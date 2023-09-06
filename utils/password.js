const bcrypt = require('bcrypt');
const { ValCode } = require('../models');
const nodemailer = require('nodemailer');

const passwordChange = async (user,oldPass,newPass) => {
    let change;
    if(newPass) {
        change = newPass ? await bcrypt.compare(oldPass,user.password) : null;
    }
};

const verifyCode = async (email, user, val) => {

    let url, subject, msg;

    if(val) {
        const createCode = `${user.lastName}${user.emailList.length}${user.firstName}${Date.now()}`;
    
        url = `${process.env.URL}/reset-password/${email}/${createCode}`;
    
        const emailCode = new ValCode({
            email, code: createCode,
            url,
            ownerId: user._id
        }).save();
    
        subject = "Portfolio Password Reset";
        msg = `
            <p>Please click the <a href="${url}">link</a>.</p>
            <br/>
            <p>If the link doesn't work, please use this: ${url}</p>
        `
    }

    if(!val) {
        //TODO: need to build out the process of email validation response.
    }

    sendEmail(user, subject, msg)
}

const sendEmail = async (user, subject,msg) => {

    // Should have two types of emails, one to the admin for password reset and one for email verification after a client sends a message.

    const fullName = `${user.firstName} ${user.lastName}`;
    try {
        
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });

        const email = await transporter.sendMail({
            from: "Personal Portfolio",
            to: user.email,
            subject: subject,
            html: msg
        })

        //Using an email variable if needing to access the transporter object.

    } catch (err) {
        console.error(err, "Email not sent.")
    }
}

module.exports = {
    passwordChange, verifyCode
}