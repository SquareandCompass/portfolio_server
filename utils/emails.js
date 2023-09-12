const nodemailer = require('nodemailer');

const sendEmail = async (user, subject,msg) => {

    // const fullName = `${user.firstName} ${user.lastName}`;
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

// Should send a "thank you" email when someone sends a message.

module.exports = {
    sendEmail,
}