const bcrypt = require('bcrypt');
const { ValCode } = require('../models');
const { sendEmail } = require('./emails')

const passwordChange = async (user,oldPass,newPass) => {
    let change;
    if(newPass) {
        change = newPass ? await bcrypt.compare(oldPass,user.password) : null;
    }
};

const verifyCode = async (email, client, val, clientMessage) => {

    let url, subject, msg;
    const eightDigitCode = Math.random().toString(36).substring(2,10);
    const year = new Date().getFullYear();

    const clientName = await client.fullName;

    const emailCode = new ValCode({
        email, 
        code: eightDigitCode,
        ownerId: client._id,
        message: clientMessage
        //TODO how to handle files being included.
    }).save();
    
    if(val) {
    
        subject = "Portfolio Password Reset Code";
        msg = `
            <div>
                <p>Greetings, ${clientName}!</p>
                <h3>Code: <h2>${eightDigitCode}</h2></h3>
                <p>Please use the provided code to change your password. You will need to update your accout with a new password. This passcode is only available for <b>20 minutes</b>.</p>
            </div>
        `
    }

    if(!val) {
        // evaluate subs status and provide a proper note within the footer of the message sent.
        const blogSubStatus = client.blogSub ? 
            `If you would like to unsubscribe to my blog, click <a href="${process.env.URL}/email/remove-blog/${email}" target="_blank">here</a>` :
            `If you would like to subscribe to my blog, click <a href="${process.env.URL}/email/add-blog/${email}" target="_blank">here</a>`;

        const letterSubStatus = client.newsLetterSub ? 
            `If you would like to unsubscribe to my newsletter, click <a href="${process.env.URL}/email/remove-letter/${email}" target="_blank">here</a>` :
            `If you would like to subscribe to my newsletter, click <a href="${process.env.URL}/email/add-letter/${email}" target="_blank">here</a>`;

        url = `${process.env.URL}/email/validated/${eightDigitCode}`
        subject = "Please Verify Your Email"
        msg = `
            <div style="border: 1px solid black; padding: .5em;">
                <p>Greetings, ${clientName}!</p>
                <article>
                    <p>Thank you for sending a message to me! This email is meant to help verify that you are, indeed, you. Once you have click the provided link below, the message will be sent to me.</p>
                    <p>With that said, you can be sure that this should be the only time this will be needed. Once verified, you can send me messages as needed to keep that line of communication open. I look forward to working with you!</p>
                </article>
                <hr/>
                <h2>Verification Link:</h2>
                <p>Please click this <a href="${url}" target="_blank">link</a>.</p>
                <p>If that link doesn't work, please copy and paste this into your address bar of your browser: 
                <br/>${url}</p>

                <hr/>
                <h4>Here is your original message: </h4>
                <span>
                    ${clientMessage}
                </span>
                <p>This is only for your reference and doesn't need to be updated moving forward.</p>
                <p>Thank you for your time!</p>
                <footer 
                    style="background-color: lightgrey; text-align: center; height: 75px; padding: .5rem;">
                    ericjwinebrenner.com &copy; ${year}
                    <br/> If you would like your email removed, please click <a href="${process.env.URL}/email/remove/${email}" target="_blank">here</a> 
                    <br/> ${blogSubStatus} | ${letterSubStatus}
                </footer>
            </div>
        `
    }

    sendEmail(client, subject, msg);

}

module.exports = {
    passwordChange, verifyCode
}