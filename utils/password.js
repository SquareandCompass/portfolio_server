const bcrypt = require('bcrypt');
const { ValCode } = require('../models');
const nodemailer = require('nodemailer');

const passwordChange = async (user,oldPass,newPass) => {
    let change;
    if(newPass) {
        change = newPass ? await bcrypt.compare(oldPass,user.password) : null;
    }
};

const verifyCode = async (email, user, val, clientMessage) => {

    let url, subject, msg;
    const eightDigitCode = Math.random().toString(36).substring(2,10);

    const userName = await user.fullName;

    const emailCode = new ValCode({
        email, 
        code: eightDigitCode,
        ownerId: user._id,
        message: clientMessage
    }).save();
    
    if(val) {
    
        subject = "Portfolio Password Reset Code";
        msg = `
            <div>
                <p>Greetings, ${userName}!</p>
                <h3>Code: <h2>${eightDigitCode}</h2></h3>
                <p>Please use the provided code to change your password. You will need to update your accout with a new password. This passcode is only available for <b>20 minutes</b>.</p>
            </div>
        `
    }

    if(!val) {
        //NOTE: Will need to include individual names stored within the email
        url = `${process.env.URL}/validated/${eightDigitCode}`
        subject = "Please Verify Your Email"
        msg = `
            <div>
                <h2>Verification Link:</h2>
                <p>Please click this <a href="${url}" target="_blank">link</a>.</p>
                <br/>
                <p>If that link doesn't work, please go to this try: ${url}</p>
                <br/>
                <h3>Here is your original Message: </h3>
                <span>
                    ${clientMessage}
                </span> 
            </div>
        `
    }

    sendEmail(user, subject, msg);

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