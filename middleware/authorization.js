const jwt = require('jsonwebtoken')
const HttpError = require('../models/http-error')

function verifyAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization.split(' ')[1]; //breaks 'Bearer <token>' into an array and extracts the token part
        if (!token) {
            throw new HttpError('Not authorized', 401);
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY); 
            //if wrong token, will throw error
            //if correct token, will return the jwt payload (userId and email)
        req.userData = { userId: decodedToken.userId, email: decodedToken.email } 
    } catch(err) {
        const error = new HttpError('Not authorized', 401);
        return next(error);
    }
}

module.exports = verifyAuth;