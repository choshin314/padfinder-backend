const HttpError = require('../models/http-error')

const getCoordinates = async (address, next) => {
    let coordinates;
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.MAPS_KEY}`);
        const data = await response.json();
        switch (data.status) {
            case "OK": 
                coordinates = data.results[0].geometry.location; 
                break;
            case "ZERO_RESULTS": 
                throw new HttpError('Address is invalid.  Please submit a valid property address.', 400);
                break;
            case "REQUEST_DENIED": 
                throw new HttpError('Something went wrong, please try again later.', 500);
                break;
            case "INVALID_REQUEST": 
                throw new HttpError('Address is invalid.  Please submit a valid property address', 400);
                break;
            case "UNKNOWN_ERROR": 
                throw new HttpError('Server error, please try again later.', 500);
                break;
        }
    } catch (err) {
        return next(err)
    }
    return coordinates;
}

module.exports = getCoordinates;