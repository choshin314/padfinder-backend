const express = require('express');
const router = express.Router();

const dummyProperties = [
    {
        id: 'p1',
        address: '1557 Sanford Ave, St. Louis, MO',
        coordinates: {
            lat: 38.6224608,
            lng: -90.298468
        },
        type: 'house',
        rent: 850,
        beds: 1,
        baths: 1,
        pets: { dogs: { allowed: true, limit: 2}, cats: { allowed: false, limit: 0}},
        description: 'Some generic description of this house or apartment.',
        sqft: 1000,
        image: 'https://specials-images.forbesimg.com/imageserve/1026205392/960x0.jpg',
    },
    {
        id: 'p2',
        address: '7355 Manchester Rd, Maplewood, MO',
        coordinates: {
            lat: 38.6140832,
            lng: -90.31923739999999
        },
        type: 'apartment',
        rent: 1250,
        beds: 2,
        baths: 2,
        pets: { dogs: { allowed: true, limit: 2}, cats: { allowed: false, limit: 0}},
        description: 'Some generic description of this house or apartment.',
        sqft: 1000,
        image: 'https://specials-images.forbesimg.com/imageserve/1026205392/960x0.jpg',
        name: 'Hawthorne Heights'
    },
    {
        id: 'p3',
        address: '6554 Manchester Rd, Maplewood, Mo',
        coordinates: {
            lat: 38.61923,
            lng: -90.30013
        },
        type: 'apartment',
        rent: 1150,
        beds: 2,
        baths: 1,
        pets: { dogs: { allowed: true, limit: 2}, cats: { allowed: false, limit: 0}},
        description: 'Some generic description of this house or apartment.',
        sqft: 1000,
        image: 'https://specials-images.forbesimg.com/imageserve/1026205392/960x0.jpg'
    }
]

router.get('/nearby/:lat-:lng', (req, res, next) => {
    const coordinates = { lat: parseFloat(req.params.lat), lng: parseFloat(req.params.lng) };

    //return array of properties that are within 3(ish) miles from submitted coordinates
    let nearbyProperties = dummyProperties.filter(p => {
        let calculateDiff = (coordA, coordB) => Math.abs(coordA - coordB);
        return (
            calculateDiff(coordinates.lat, p.coordinates.lat) <= 0.05 && 
            calculateDiff(coordinates.lng, p.coordinates.lng) <= 0.06
        )
    });

    res.json(nearbyProperties);
})


module.exports = router;