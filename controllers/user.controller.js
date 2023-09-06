const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { validateSession } = require('../middleware');
const {success,incomplete,error,token} = require('../utils');
const SECRET = process.env.JWT;

//* NOTE: Account creation is spun up from the Database. There shouldn't a way for users to create an account from the client side.
//! Create
router.post('/create-account', async (req,res) => {
    try {
        
        const {email, backupEmail, password, passwordCheck} = req.body;

        if(password !== passwordCheck) throw new Error('Please make sure that your password matches the check');

        const user = await new User({
            email, backupEmail,
            password: bcrypt.hashSync(password, 13)
        }).save();

        const package = {
            user, 
            token: await token(user,SECRET),
        }

        user ? success(res, package) : incomplete(res);

    } catch (err) {
        error(res, err);
    }
});

//! Login
router.post('/', async (req,res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email: email});
        const passwordCheck = await bcrypt.compare(password, user.password);

        if( !user || !passwordCheck) throw new Error('Email or password does not match any records.');

        const package = {
            user,
            token: token(user,SECRET)
        }

        user ? success(res, package) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
});

//! Profile Update
router.put('/profile', validateSession, async (req,res) => {
    try {

        const filter = {_id: req.user._id};
        const info = req.body;
        const returnOption = {new:true};

        let changePassword = info.newPassword ? bcrypt.compare(info.password, req.user.password) : null;

        const updateInfo = {
            email: info.email,
            password: changePassword ? bcrypt.hashSync(info.newPassword, 13) : null,
            facebook: info.facebook, 
            twitter: info.twitter, 
            gitHub: info.gitHub, 
            linkedIn: info.linkedIn, 
            instagram: info.instagram,
        }

        const update = await User.findOneAndUpdate(filter, updateInfo, returnOption);

        update ? success(res, update) : incomplete(res);
        
    } catch (err) {
        error(res,err);
    }
});

//! Password Reset


module.exports = router;