const router = require('express').Router();
const { Message, Email } = require('../models');
const { validateSession } = require('../middleware')
const { success, incomplete, error, verifyCode } = require('../utils');

//! Create Message
router.post('/', async(req,res) => {
    try {
        const {email, firstName, lastName, company, title, message } = req.body;

        let clientEmail;
        let status;

        const returningEmail = await Email.findOne({email: email});

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
            sendMessage = await verifyCode(clientEmail.email, clientEmail, false, message);
            status = `An email was sent to verify this email.`

            //NOTE: Need to create an update for the email controller
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