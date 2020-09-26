const mongoose = require('mongoose');

const verifyAuth = require('../middleware/authorization');
const HttpError = require('../models/http-error');
const { uploadFile, deleteFiles, bucketName } = require('../util/google-storage');
const getCoordinates = require('../util/google-coordinates');
const { Property, validateProperty } = require('../models/property-model');
const { User } = require('../models/user-model');

const listInBulk = async (req, res, next) => {
    const {rawProperties} = req.body;
    const {userId} = req.userData.userId;

    //grab the associated User by UserId
    const user = await User.findById(userId);

    //filter out listings that don't have property
    const filteredProps = rawProperties.filter(el => (
        el.address.line && el.address.city && el.address.state_code && el.address.postal_code 
        && el.address.lat && el.address.lon
    ))
    //map raw data to flat object.  Also check values to make sure it's all there, otherwise use defaults.
    function checkValue(value, defaultValue) {
        return (value ? value : defaultValue)
    }
    const formattedProps = filteredProps.map(el => {
        if (el["data_source_name"] === "co-star" || el["data_source_name"] === "community_rental") {
            return {
                type: checkValue(el.prop_type, 'apartment'),
                street: el.address.line, 
                city: el.address.city,
                state: el.address.state_code,
                zip: el.address.postal_code,
                neighborhood: checkValue(el.address.neighborhood_name, el.address.city),
                latitude: el.address.lat,
                longitude: el.address.lon,
                beds: [ checkValue(el.community.beds_min, 1), checkValue(el.community.beds_max, 1) ],
                baths: [ checkValue(el.community.baths_min, 1), checkValue(el.community.baths_max, 1) ],
                size: [ checkValue(el.community.sqft_min, 0), checkValue(el.community.sqft_max, 0) ],
                rent: [ checkValue(el.community.price_min, 0), checkValue(el.community.price_max, 0) ],
                laundry: "in unit",
                parking: "covered garage",
                utilities: "electric",
                pets:	{
                    dogs: checkValue(el.client_display_flags.allows_dogs, true),
                    cats: checkValue(el.client_display_flags.allows_cats, false)
                },
                photos:	el.photos,
            }
            
        } else if (el["data_source_name"] === "unit_rental" || el["data_source_name"] === "mls") {
            if (el.price) {
                return {
                    type: checkValue(el.prop_type, 'single_family'),
                    street: el.address.line,
                    city: el.address.city,
                    state: el.address.state_code,
                    zip: el.address.postal_code,
                    neighborhood: checkValue(el.address.neighborhood_name, el.address.city),
                    latitude: el.address.lat,
                    longitude: el.address.lon,
                    beds: [checkValue(el.beds, 1), checkValue(el.beds, 1)],
                    baths: [checkValue(el.baths, 1), checkValue(el.baths, 1)],
                    size: [checkValue(el.building_size.size, 0), checkValue(el.building_size.size, 0)],
                    rent: [checkValue(el.price, 0), checkValue(el.price, 0)],
                    laundry: "in unit",
                    parking: "on street",
                    utilities: "electric and gas",
                    pets: { dogs: true, cats: false },
                    photos:	el.photos
                }
            }
        }
    });
    //map the flat objects to the correct Property schema, loop thru array and save new property + add to 
    //creator's listings array
    try {
        for (let p of formattedProps) {
            let newProperty = new Property({
                type: p.type,
                available_date: "2020-12-01T05:00:00.000Z",
                details: {
                    pet_policy: p.pets,
                    beds: p.beds,
                    baths: p.baths,
                    size: p.size,
                    rent: p.rent,
                    neighborhood: p.neighborhood,
                    laundry: p.laundry,
                    utilities: p.utilities,
                    parking: p.parking
                },
                address: {
                    street: p.street,
                    city: p.city,
                    state: p.state,
                    zip: p.zip
                },
                location: {
                    type: "Point",
                    coordinates: [p.longitude, p.latitude]
                },
                photos: p.photos,
                creator: userId,
                favorited_by: []
            });
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await newProperty.save({ session: sess });
            user.listings.push(newProperty); //mongoose will just push the id, not the whole property
            await user.save({session: sess});
            await sess.commitTransaction();
            console.log(newProperty._id);
        }
        console.log('all done')
    } catch(err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }

    res.json(user.listings);
}

module.exports = listInBulk