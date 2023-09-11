const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = validateSession = async(req,res,next) => {
    try {
        const token = req.headers.authorization;
        const decoded = await jwt.verify(token, process.env.JWT);
        const user = await User.findById(decoded.id);
        req.user = user;

        return next();
    } catch (err) {
        res.json({message: err.message})
    }
}