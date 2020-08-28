const { validationResult } = require('express-validator');

const validateIncomingValues = (req) => {
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data', 422);
        next(error);
    }
}

module.exports = validateIncomingValues;