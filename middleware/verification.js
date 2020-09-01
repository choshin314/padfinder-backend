const jwt = require('jsonwebtoken')
const HttpError = require('../models/http-error')

function verifyAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new HttpError('Authentication failed', 401);
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY); //will throw error if wrong token
        req.userData = { userId: decodedToken.userId, email: decodedToken.email } 
    } catch(err) {
        const error = new HttpError('Authentication failed', 401);
        return next(error);
    }
}

module.exports = verifyAuth;