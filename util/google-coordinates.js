const HttpError = require('../models/http-error')
const axios = require('axios');

const getCoordinates = async (address, next) => {
    let coordinates;
    let formatted_address;
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.MAPS_KEY}`);
        const responseData = response.data;
        switch (responseData.status) {
            case "OK": 
                coordinates = responseData.results[0].geometry.location; 
                formatted_address = responseData.results[0].formatted_address;
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
    return { coordinates, formatted_address }
}

module.exports = getCoordinates;