const router = require('express').Router();
const { Message, Email, BlackList, ValCode } = require('../models');
const { validateSession } = require('../middleware')
const { success, incomplete, error, verifyCode } = require('../utils');

//! Create Message
router.post('/', async(req,res) => {
    try {
        const {email, firstName, lastName, company, title, message } = req.body;

        let clientEmail;
        let status;

        const returningEmail = await Email.findOne({email: email});
        const checkBlackList = await BlackList.findOne({email: email});

        if(checkBlackList !== null && checkBlackList.warnings === 5) {
            // If an email is on the blacklist with a warning of 4 or greater, it will reject the message and remove the email from the email collection.
            await Email.findOneAndDelete({email: email});

            throw new Error(`Sorry, but messages from this email are no longer being accepted.`); 

        }

        if(!returningEmail) {
            clientEmail = await new Email({
                email, firstName, lastName, title, company
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

            const checkValCounts = await ValCode.find({email: email});

            // This checks to see how many validation attemps have been made within the 20 minute window.
            if(checkValCounts.length > 2) {
                const checkBlackList = await BlackList.findOne({email: email});
                // If the count is greater than 2, it will place that email in the blacklist collection and track warnings & timestamps.
                if(checkBlackList) {
                    let info = {
                        warnings: checkBlackList.warnings + 1
                    }
                    let today = new Date();
                    await BlackList.findOneAndUpdate({email: email},info);
                    await BlackList.findOneAndUpdate({email: email}, {$push: {warningDates: today}});
                } else {
                    await new BlackList({email});
                }

            }

            sendMessage = await verifyCode(clientEmail.email, clientEmail, false, message);
            status = `An email was sent to verify this email.`

        }

        status ? success(res, status) : incomplete(res);

    } catch (err) {
        error(res, err);
    }
});

//! Get All Messages
router.get('/all', validateSession, async(req,res) => {
    try {
        
        const messages = await Message.find();
        messages ? success(res, messages) : incompleted(res);

    } catch (err) {
        error(res,err);
    }
});

//! Get All Messages by Email
router.get('/all/:email', validateSession, async(req,res) => {
    try {
        
        const {email} = req.params;
        const messages = await Message.find({from: email});
        messages ? success(res,messages) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
    
});

//! Get One Message
router.get('/:id', validateSession, async(req,res) => {
    try {
        const {id} = req.params;
        const msg = await Message.findOne({_id:id});
        msg ? success(res,msg) : incomplete(res)
    } catch (err) {
        error(res,err);
    }
});

//! Update Message
router.put('/update/:id', validateSession, async(req,res) => {
    try {

        const { id } = req.params;
        const info = req.body;
        const options = {new:true};

        const statusInfo = {
            resolved: info.resolved,
            archive: info.archive,
            adminNotes: info.adminNotes,
            dateUpdated: new Date(),
        }

        const updateMsg = await Message.findOneAndUpdate({_id: id},statusInfo,options);
        
        updateMsg ? success(res,updateMsg) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
});

//! Delete Message
router.delete('/remove/:id', validateSession, async(req,res) => {
    try {
        const { id } = req.params;
        let msg;

        const findMsg = await Message.findById(id);
        const delMsg = await Message.findOneAndDelete({_id: id});

        if(delMsg) {
            await Email.findOneAndUpdate({_id: findMsg.from},{$pull:{'messages': id}});
            msg = 'Message removed'
        }

        msg ? success(res,msg) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
});

module.exports = router;