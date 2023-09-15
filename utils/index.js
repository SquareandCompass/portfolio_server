const { successResponse, incompleteResponse, errorResponse} = require('./responses');
const token = require('./token');
const {passwordChange,verifyCode} = require('./password');
const s3 = require('./s3');

module.exports = {
    success: successResponse,
    incomplete: incompleteResponse,
    error: errorResponse,
    token: token,
    passwordChange: passwordChange,
    verifyCode: verifyCode,
    s3: s3,
}