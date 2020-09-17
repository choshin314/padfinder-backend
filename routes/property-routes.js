const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const fs = require('fs');

const verifyAuth = require('../middleware/authorization');
const HttpError = require('../models/http-error');
const { uploadFile, deleteFiles } = require('../util/google-storage');
const getCoordinates = require('../util/google-coordinates');
const { Property, validateProperty } = require('../models/property-model');
const { User } = require('../models/user-model');
// const properties = require('../formattedProperties.json')

//get properties near searched location
router.get('/nearby/string/:queryString', async (req, res, next) => {
    const queryString = req.params.queryString;
    const { coordinates, formatted_address } = await getCoordinates(queryString, next); 
    let nearbyProperties;
    //return array of properties (nearest to furthest) that are within 3(ish) miles from submitted coordinates
    try {
        nearbyProperties = await Property.find({
            location: {
                $near: {
                    // $maxDistance: 15000,
                    $geometry: {
                        type: "Point",
                        coordinates: [coordinates.lng, coordinates.lat]
                    }
                }
            }
        }).limit(20);
    } catch(err) {
        const error = new HttpError('Error retrieving properties, please try again', 500);
        return next(error);
    }
    res.json({ coordinates, formatted_address, nearbyProperties });
})


router.get('/nearby/coordinates/:lat-:lng', async (req, res, next) => {
    const coordinates = { lat: parseFloat(req.params.lat), lng: parseFloat(req.params.lng) };
    let nearbyProperties;
    //return array of properties (nearest to furthest) that are within 3(ish) miles from submitted coordinates
    try {
        nearbyProperties = await Property.find({
            location: {
                $near: {
                    // $maxDistance: 15000,
                    $geometry: {
                        type: "Point",
                        coordinates: [coordinates.lng, coordinates.lat]
                    }
                }
            }
        }).limit(20);
    } catch(err) {
        const error = new HttpError('Error retrieving properties, please try again', 500);
        return next(error);
    }
    res.json(nearbyProperties);
})


//--------------------PROTECTED ROUTES (Auth required for routes below)-----------//
router.use(verifyAuth);

//get listings by User ID (creator)
router.get('/:userId/listings', async (req, res, next) => {
    const userId = req.params.userId;
    let listings;
    try {
        let user = await User.findById(userId).populate('listings');
        listings = user.listings;
    } catch(err) {
        const error = new HttpError('Could not retrieve listings', 500);
        return next(error);
    }
    res.status(200).json(listings);
})

//create new property
router.post('/new', async (req, res, next) => {
    let parsedFormData = {
        type: JSON.parse(req.body.type),
        available_date: JSON.parse(req.body.available_date),
        address: JSON.parse(req.body.address),
        details: JSON.parse(req.body.details)
    }
    const {type, available_date, address, details} = req.body;

    const validationResult = validateProperty(parsedFormData)
    if (validationResult.error) {
        const error = new HttpError(validationResult.error.details[0].message, 422)
        return next(error); //if data fails Joi validation, kick this to the error handler middleware
    }
    //check if property already exists
    try {
        let existingProperty = await Property.findOne({ 
            'address.street': address.street,
            'address.zip': address.zip
        })
        if (existingProperty) throw new Error();
    } catch (err) {
        const error = new HttpError('Property already listed', 400);
        return next(error)
    }
    

    //----------------------PHOTO UPLOAD-------------------//
    let files = req.files.photos; 
    //move each photo to uploads/images
    for (const file of files) {
        file.mv(`./uploads/images/${file.name}`)
    }
    //upload photos to google cloud
    try {
        for (const file of files) {
            await uploadFile(`./uploads/images/${file.name}`)
        }
    } catch(err) {
        const error = new HttpError('Could not upload images.  Please try again later.', 500);
        return next(error);
    }

    //get coordinates
    const { street, city, state, zip } = address;
    let queryString = `${street}+${city}+${state}+${zip}`;
    queryString = queryString.replace(/(\s)/g, '+');
    const { coordinates } = await getCoordinates(queryString, next);

    //create new property
    let newProperty = new Property({
        ...parsedFormData,
        location: {
            type: "Point",
            coordinates: [coordinates.lng, coordinates.lat]
        },
        coordinates: coordinates,
        photos: files.map(file => ({ href: `https://storage.googleapis.com/padfinder_bucket/${file.name}` })),
        creator: req.userData.userId,
        favorited_by: []
    });

    //grab the associated User by UserId
    let user;
    try {
        user = await User.findById(req.userData.userId)
    } catch(err) {
        const error = new HttpError('Could not find user for provided user ID', 404);
        return next(error)
    }

    /*Transaction: 1) Save new property, 2) Add new property ID to corresponding User*/ 
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newProperty.save({ session: sess });
        user.listings.push(newProperty); //mongoose will just push the id, not the whole property
        await user.save({session: sess});
        await sess.commitTransaction();
    } catch(err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }

    //delete local photo files after upload to google 
    files.forEach(file => fs.unlink(`./uploads/images/${file.name}`, err => {if(err) console.log(err)}))
    
    //send new property back to frontend
    res.status(201).json(newProperty);
})

//update a property.  Cannot alter address or type.  Can only change details, available date, and photos.
router.patch('/update/:propertyId', async (req, res, next) => {
    let property;
    let parsedFormData = {
        type: JSON.parse(req.body.type),
        available_date: JSON.parse(req.body.available_date),
        address: JSON.parse(req.body.address),
        details: JSON.parse(req.body.details)
    }
    const toBeDeleted = JSON.parse(req.body.toBeDeleted);
    const {type, available_date, address, details } = parsedFormData;
    console.log(parsedFormData)
    console.log('toBeDeleted: ', toBeDeleted)
    // console.log('photos to add: ', req.files.photos)
    // console.log(typeof req.files.photos)

    const validationResult = validateProperty(parsedFormData)
    if (validationResult.error) {
        const error = new HttpError(validationResult.error.details[0].message, 422)
        return next(error); //if data fails Joi validation, kick this to the error handler middleware
    }

    try {
        property = await Property.findById(req.params.propertyId).populate('creator')
    } catch(err) {
        const error = new HttpError('Could not update property', 500);
        return next(error);
    }

    if (!property) {
        const error = new HttpError('Could not find a property with the given ID', 404);
        return next(error);
    }
    
    if (req.userData.userId !== property.creator._id.toString()) {
        const error = new HttpError('Not authorized to update this listing', 403);
        return next(error);
    }

    //----------------------PHOTO UPLOAD / DELETE-------------------//
    let files = req.files ? req.files.photos : null; 
    let photosToAdd;
    if (files && !Array.isArray(files)) {
        files.mv(`./uploads/images/${files.name}`);
        try {
            await uploadFile(`./uploads/images/${files.name}`, next)
        } catch(err) {
            const error = new HttpError('Could not upload image. Please try again later.', 500);
            return next(error);
        }
        photosToAdd = [{ href: `https://storage.googleapis.com/padfinder_bucket/${files.name}` }]
        fs.unlink(`./uploads/images/${files.name}`, err => {if(err) console.log(err)})
    }

    if (files && Array.isArray(files)) {
        for (const file of files) { file.mv(`./uploads/images/${file.name}`) }
        try {
            for (const file of files) { 
                await uploadFile(`./uploads/images/${file.name}`, next) 
            };
        } catch(err) {
            const error = new HttpError('Could not upload images.  Please try again later.', 500);
            return next(error);
        }
        photosToAdd = files.map(file => ({ href: `https://storage.googleapis.com/padfinder_bucket/${file.name}` }));
        //delete local photo files after upload to google 
        files.forEach(file => fs.unlink(`./uploads/images/${file.name}`, err => {if(err) console.log(err)}))
    }

    if(toBeDeleted && toBeDeleted.length > 0) {
        const photoFileNames = toBeDeleted.map(fullUrl => fullUrl.split('padfinder_bucket/')[1]);
        try {
            await deleteFiles(photoFileNames, next);
        } catch(err) {
            console.log(err);
        }
    }
    //------------------save changes to Property document---------------//
    try {
        property.details = {
            ...property.details,
            ...details
        };
        property.available_date = available_date;
        if(photosToAdd) property.photos = [...property.photos, ...photosToAdd];
        if (toBeDeleted) {
            property.photos = property.photos.filter(p => !toBeDeleted.includes(p.href))
        }
        await property.save();
    } catch(err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }

    res.status(201).json(property)
})

//remove a property
router.delete('/delete/:id', async (req, res, next) => {
    const propertyId = req.params.id;
    let property;
    try {
        property = await Property.findById(propertyId).populate('creator').populate('favorited_by');
    } catch(err) {
        const error = new HttpError('Could not delete property', 500);
        return next(error);
    }

    if (!property) {
        const error = new HttpError('Could not find a property with the given ID', 404);
        return next(error);
    }

    if (req.userData.userId !== property.creator._id.toString()) {
        const error = new HttpError('Not authorized to delete this listing', 403);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await property.remove({ session: sess });   //delete property
        property.creator.listings.pull(property);   //remove property ref from creator's listings
        await property.creator.save({ session: sess });
        //remove property from the fave list of anyone who faved it
        for(let user of property.favorited_by) {    
            user.favorites.pull({ _id: property._id });
            await user.save({ session: sess })
        }
        await sess.commitTransaction();
    } catch(err) {
        const error = new HttpError('Something went wrong. Could not delete listing.', 500);
        return next(error);
    }

    const photoFileNames = property.photos.map(photo => photo.href.split('padfinder_bucket/')[1]);
    try {
        await deleteFiles(photoFileNames, next);
    } catch(err) {
        console.log(err);
    }

    res.status(200).json({ message: 'Deleted listing.' })
})



//--------------------------------FAVORITES----------------------------//
//save favorite properties by User ID & Property ID
router.patch('/:userId/favorites/add/:propertyId', async (req, res, next) => {
    let { userId, propertyId } = req.params;
    let user;
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        //update User's favorites array
        user = await User.findById(userId).populate('favorites');
        user.favorites.push({_id: propertyId});
        await user.save({ session: sess });
        //update Property's favorited_by array
        const property = await Property.findById(propertyId);
        property.favorited_by.push({_id: userId});
        await property.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Could not add to favorites', 500);
        return next(error);
    }
    res.status(201).json(user.favorites); //sends full objects bc populated
})

//remove favorite properites by User ID & Property ID
router.patch('/:userId/favorites/remove/:propertyId', async (req, res, next) => {
    let { userId, propertyId } = req.params;
    let user;
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        user = await User.findById(userId).populate('favorites');
        user.favorites.pull({_id: propertyId});
        await user.save({ session: sess });
        const property = await Property.findById(propertyId);
        property.favorited_by.pull({ _id: userId });
        await property.save({ session: sess });
        await sess.commitTransaction();
    } catch(err) {
        const error = new HttpError('Could not remove from favorites', 500);
        return next(error);
    }
    res.status(202).json(user.favorites);
})

//get favorite properties by User ID
router.get('/:userId/favorites', async (req, res, next) => {
    let favs;
    try {
        let user = await User.findById(req.params.userId).populate('favorites');
        favs = user.favorites;
        console.log(user)
    } catch(err) {
        const error = new HttpError('Could not retrieve favorites', 500);
        return next(error);
    }
    res.status(200).json(favs);
})


// router.get('/all', (req, res, next) => {
//     let formattedProps = properties.map(p => {
//         if (p.details.rent.length > 1) {
//             return p
//         } else {
//             return {
//                 ...p,
//                 details: {
//                     ...p.details, 
//                     rent: [p.details.rent[0], p.details.rent[0]],
//                     beds: [p.details.beds[0], p.details.beds[0]],
//                     baths: [p.details.baths[0], p.details.baths[0]],
//                     size: [p.details.size[0], p.details.size[0]]
//                 }
//             }
//         }
//     });
//     res.json(formattedProps);
// })

module.exports = router;

