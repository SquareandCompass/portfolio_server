const { successResponse, incompleteResponse, errorResponse} = require('./responses');
const token = require('./token');
const {passwordChange,verifyCode} = require('./password');

module.exports = {
    success: successResponse,
    incomplete: incompleteResponse,
    error: errorResponse,
    token: token,
    passwordChange: passwordChange,
    verifyCode: verifyCode,
}