const router = require('express').Router();
const { validateSession } = require('../middleware')
const { success, error, incomplete } = require('../utils');
const { Email, ValCode, Message, BlackList } = require('../models');

//! Validation
router.put('/validated/:code', async(req,res) => {
    try {
        const { code } = req.params;
        const validCode = await ValCode.findOne({code: code});
        const clientEmail = await Email.findOne({email: validCode.email});
        const message = await new Message({
            content: validCode.message,
            from: clientEmail._id,
            //NOTE: Will need to consider how provided files/links are passed. May need to update the validationCodes schema to hold these.
        }).save();

        await clientEmail.updateOne({validated: true, $push: {'messages': message._id}});

        message ? success(res,message) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
});

//! unsub routes
router.put('/:sub/:email', async(req,res) => {
    try {
        
        const { sub, email } = req.params;
        let blogSub;
        let newsLetterSub;

        console.log('EMAIL CONTROLELR: ', sub, email)
        
        if(sub === 'add-blog') {
            blogSub = true;
        } else if(sub === 'remove-blog') {
            blogSub = false;
        } else if (sub === 'remove-letter') {
            newsLetterSub = false
        } else {
            newsLetterSub = true
        }
        
        let info = {
            blogSub, newsLetterSub
        }

        const updateSubs = await Email.findOneAndUpdate({email}, info, {new:true});

        updateSubs ? success(res, updateSubs) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
    
});

//! Delete Email Document
//? Remove Email by email owner
router.delete('/remove/:email', async(req,res) => {
    try {
        
        const { email } = req.params;
        let msg;
        
        let remove = await Email.findOneAndDelete({email});

        remove ? msg = 'Email account has been removed by the client.' : null

        msg ? success(res, msg) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
    
});

//! Admin routes
//? Create
router.post('/', validateSession, async(req,res) => {
    try {
        
        const { 
            firstName, lastName, title, email, blogSub, newsLetterSub, validated, company, notes
        } = req.body;

        let info = {
            firstName, lastName, title, email, blogSub, newsLetterSub, validated, company, notes
        };

        let newEmail = await new Email(info).save();

        newEmail ? success(res, newEmail) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
});

//? Get All Emails
router.get('/all', validateSession, async(req,res) => {
    try {
        
        const emails = await Email.find();

        emails ? success(res,emails) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
});

//? Get One Email
router.get('/client/:id', validateSession, async(req,res) => {
    try {
        
        const { id } = req.params;

        const clientEmail = await Email.findById(id);

        clientEmail ? success(res, clientEmail) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
});

//? Get All Emails by Company
router.get('/clients/:company', validateSession, async(req,res) => {
    try {
        
        const {company} = req.params;
        const emails = await Email.find({company: company});

        emails ? success(res,emails) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
});

//? Update
router.put('/client/:id', validateSession, async(req,res) => {
    try {
        
        const { id } = req.params;
        const {
            firstName, lastName, title, email, blogSub, newsLetterSub, validated, company, notes
        } = req.body;
        const options = {new:true};

        const updatedInfo = {
            firstName, lastName, title, email, blogSub, newsLetterSub, validated, company, notes
        }

        const client = await Email.findOneAndUpdate({_id: id}, updatedInfo, options);

        client ? success(res,client) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
});

//? Remove Email
// Should add to blacklist?
router.delete('/client/:id', validateSession, async(req,res) => {
    try {
        
        const { id } = req.params;

        const client = await Email.findById(id);
        await new BlackList({
            email: client.email,
            warnings: 5
        }).save();
        await Message.deleteMany({from: client._id});

        const removeClient = await Email.findOneAndDelete({_id:id});

        const msg = 'Email has been deleted and added to the black list'

        removeClient ? success(res, msg) : incomplete(res);

    } catch (err) {
        error(res,err);
    }

});

module.exports = router;