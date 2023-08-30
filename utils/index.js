const { successResponse, incompleteResponse, errorResponse} = require('./responses');
const token = require('./token');

module.exports = {
    success: successResponse,
    incomplete: incompleteResponse,
    error: errorResponse,
    token: token,
}