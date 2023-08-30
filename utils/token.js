const jwt = require('jsonwebtoken');

module.exports = (user, SECRET) => {
    const id = {id: user._id};
    const expires = {expiresIn: '1 day'};

    return jwt.sign(id, SECRET, expires);
}