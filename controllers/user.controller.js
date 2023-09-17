const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User, ValCode } = require('../models');
// const { validateSession, multer } = require('../middleware');
const { validateSession, } = require('../middleware');
const {
    success, incomplete, error, token, verifyCode, s3
} = require('../utils');
const SECRET = process.env.JWT;

//* Multer - would like to separate this out into another file
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


//* NOTE: Account creation is spun up from the Database. There shouldn't a way for users to create an account from the client side.
//! Create
router.post('/create-account', async (req, res) => {
    try {

        const { email, backupEmail, password, passwordCheck } = req.body;

        if (password !== passwordCheck) throw new Error('Please make sure that your password matches the check');

        const user = await new User({
            email, backupEmail,
            password: bcrypt.hashSync(password, 13)
        }).save();

        const package = {
            user,
            token: await token(user, SECRET),
        }

        user ? success(res, package) : incomplete(res);

    } catch (err) {
        error(res, err);
    }
});

//! Login
router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        const passwordCheck = await bcrypt.compare(password, user.password);

        if (!user || !passwordCheck) throw new Error('Email or password does not match any records.');

        const package = {
            user,
            token: token(user, SECRET)
        }

        user ? success(res, package) : incomplete(res);

    } catch (err) {
        error(res, err);
    }
});

//! Profile Update
// router.put('/profile', validateSession, multer, async (req, res) => {
// router.put('/profile', validateSession, upload.single("avatar"), async (req, res) => {
router.put('/profile', 
    validateSession, upload.fields([
            {name: 'avatar', maxCount: 1},
            {name: "logo", maxCount: 1},
            // {name: "files", maxCount: 10} // placeholder for multi-files
        ]), 
async (req, res) => {
    try {
        
        const filter = { _id: req.user._id };
        const info = req.body;
        const returnOption = { new: true };
        let avatarFileURL;
        let logoFileURL;

        let changePassword = info.newPassword ? bcrypt.compare(info.password, req.user.password) : null;

        let updatedPassword;

        if (changePassword) {
            updatedPassword = bcrypt.hashSync(info.newPassword, 13);
        }

        // console.log('BODY: ', req.body);
        // console.log('PROFILE: ', req.files);

        // const avatarCheck = req.files.avatar.filter(x => x.fieldname == 'avatar');
        if(req.files.avatar.filter(x => x.fieldname == 'avatar')) {
            await s3(req, 'avatar');
            avatarFileURL = req.s3;
            // console.log(avatarFileURL)
        }
        
        // if(req.files.avatar.filter(x => x.fieldname == 'logo')) {
        //     await s3(req);
        //     logoFileUrl = req.s3
        //     await fetch(logoFileURL, {
        //         headers: {
        //             "Content-Type":"multipart/form-data"
        //         }
        //     })
        // }

        const updateInfo = {
            firstName: info.firstName,
            lastName: info.lastName,
            email: info.email,
            backupEmail: info.backupEmail,
            password: updatedPassword,
            facebook: info.facebook,
            twitter: info.twitter,
            gitHub: info.gitHub,
            linkedIn: info.linkedIn,
            instagram: info.instagram,
            // avatar: avatarFileURL,
            // logo: logoFileURL
        }

        const update = await User.findOneAndUpdate(filter, updateInfo, returnOption);

        update ? success(res, update) : incomplete(res);

    } catch (err) {
        error(res, err);
    }
});

//? Profile Images Update
router.put('/set-image', validateSession, async (req, res) => {
    if (req.headers['content-type']) {
        await s3(req);
    }

    res.status(200).json({url: req.s3})
})

//! Password Reset
router.post('/password-reset-request', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) throw new Error('Incorrect email');

        verifyCode(email, user, true);

        const package = { message: 'Email sent' };

        user ? success(res, package) : incomplete(res);

    } catch (err) {
        error(res, err);
    }
});

router.patch('/reset-password/:email', async (req, res) => {
    try {

        const { email } = req.params;
        const { code, password, passwordCheck } = req.body;

        const codeCheck = await ValCode.findOne({ email: email, code: code })
        if (!codeCheck) throw new Error(`There is an issue with the provided code. Please input a correct code or request a new one.`);

        if (password !== passwordCheck) throw new Error(`Please be sure that passwords match.`)

        const updatePassword = {
            password: bcrypt.hashSync(password, 13)
        }

        const userCheck = await User.findOneAndUpdate({ email: email }, updatePassword, { new: true });

        userCheck ? success(res, userCheck) : incomplete(res);

    } catch (err) {
        error(res, err);
    }
});

module.exports = router;