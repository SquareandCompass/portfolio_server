const router = require('express').Router();
const { Message, Email } = require('../models');
const { success, incomplete, error, verifyCode } = require('../utils');

//! Create Message
router.post('/', async(req,res) => {
    try {
        const {email, firstName, lastName, title, message } = req.body;

        let clientEmail;
        let newMessage;
        let status;

        const returningEmail = await Email.findOne({email: email});

        if(!returningEmail) {
            clientEmail = await new Email({
                email, firstName, lastName, title
            }).save()
        } else {
            clientEmail = returningEmail;
        }

        if(clientEmail.validated) {
            status = await new Message({
                content: message,
                from: clientEmail._id
            }).save()

            await Email.findByIdAndUpdate({_id: clientEmail._id}, {$push: {messages: status._id}})

        } else {
            sendMessage = await verifyCode(clientEmail.email, clientEmail, false, message);
            status = `An email was sent to verify this email.`

            //NOTE: Need to create an update for the email controller
        }

        status ? success(res, status) : incomplete(res);

    } catch (err) {
        error(res, err);
    }
});

//! Delete Message
// Only Admin should be able to do this.

module.exports = router;