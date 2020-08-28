const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

const validateIncomingValues = (req, next) => {
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data', 422);
        console.log(error);
    }
}

module.exports = validateIncomingValues;