const HttpError = require('../models/http-error')
const axios = require('axios').default;

const getCoordinates = async (address, next) => {
    let coordinates;
    try {
        const responseData = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.MAPS_KEY}`);
        switch (responseData.status) {
            case "OK": 
                coordinates = responseData.results[0].geometry.location; 
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