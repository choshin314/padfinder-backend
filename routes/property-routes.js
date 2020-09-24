const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const fs = require('fs');
const axios = require('axios');
const nodemailer = require('nodemailer');

const verifyAuth = require('../middleware/authorization');
const HttpError = require('../models/http-error');
const { uploadFile, deleteFiles, bucketName } = require('../util/google-storage');
const getCoordinates = require('../util/google-coordinates');
const { Property, validateProperty } = require('../models/property-model');
const { User } = require('../models/user-model');

// const properties = require('../formattedProperties.json')

//-------------------SEND EMAIL TO PROPERTY CREATOR--------------------------//
router.post('/inquiry', async (req, res, next) => {
    const {name, email, moveInDate, phone, message, propertyId} = req.body;
    let property;

    try {
        property = await Property.findById(propertyId).populate('creator', 'email');
    } catch(err) {
        const error = new HttpError('Could not retrieve listing information', 500);
        return next(error);
    }

    if (!property) {
        const error = new HttpError('Could not find a listing with the given ID', 404);
        return next(error);
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        disableUrlAccess: true
    });

    try {
        let info = await transporter.sendMail({
            from: '"Padfinder Inquiries" <shinchodev@gmail.com>',
            to: property.creator.email,
            subject: `New Inquiry for ${property.address.street}`,
            text: message,
            html: `<h3>Sender Details:</>
                <ul>
                    <li>Sender Name: ${name}</li>
                    <li>Sender Email: ${email}</li>
                    <li>Sender Phone: ${phone}</li>
                    <li>Move-In Date: ${moveInDate}</li>
                </ul>
                <h3>Message:</h3>
                <p>${message}</p>`
        });
        console.log('message sent ', info.messageId);
    } catch (err) {
        console.log(err);
        const error = new HttpError('Could not send email at this time', 500);
        return next(error);
    }
    res.status(200).json({ message: 'Message sent!'})
})

//-------------------GET PROPERTIES NEAR GEOLOCATION OR SEARCHED LOCATION-----------//

router.get('/nearby', async (req, res, next) => {
    let { queryString, lat, lng, limit } = req.query;
    limit = limit ? parseInt(limit) : 100;
    const coordinates = { lat, lng };
    let formatted_address;
    let nearbyProperties;
    if (queryString) {
        const results = await getCoordinates(queryString, next);
        coordinates.lat = results.coordinates.lat;
        coordinates.lng = results.coordinates.lng;
        formatted_address = results.formatted_address;
    }
    try {
        nearbyProperties = await Property.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(coordinates.lng), parseFloat(coordinates.lat)]
                    }
                }
            }
        }).limit(limit)
    } catch(err) {
        const error = new HttpError('Error retrieving properties, please try again', 500);
        return next(error);
    }
    res.json({ nearbyProperties, formatted_address, coordinates });
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
    const { street, city, state, zip } = parsedFormData.address;

    const validationResult = validateProperty(parsedFormData)
    if (validationResult.error) {
        const error = new HttpError(validationResult.error.details[0].message, 422)
        return next(error); //if data fails Joi validation, kick this to the error handler middleware
    }
    //check if property already exists
    try {
        let existingProperty = await Property.findOne({ 
            'address.street': street,
            'address.zip': zip
        })
        if (existingProperty) throw new Error();
    } catch (err) {
        const error = new HttpError('This listing already exists', 400);
        return next(error)
    }
    
    //----------------------PHOTO UPLOAD-------------------//
    let files = req.files.photos; 
    for (const file of files) {
        file.mv(`./uploads/images/${file.name}`)
    }
    try {
        for (const file of files) {
            await uploadFile(`./uploads/images/${file.name}`)
        }
    } catch(err) {
        const error = new HttpError('Could not upload images.  Please try again later.', 500);
        return next(error);
    }
    files.forEach(file => fs.unlink(`./uploads/images/${file.name}`, err => {if(err) console.log(err)}))

    //-----------------------GET COORDINATES----------------//
    let queryString = `${street}+${city}+${state}+${zip}`;
    queryString = queryString.replace(/\s/g, '+');
    const { coordinates } = await getCoordinates(queryString, next);

    //----------------------CREATE NEW PROPERTY---------------//
    let newProperty = new Property({
        ...parsedFormData,
        location: {
            type: "Point",
            coordinates: [coordinates.lng, coordinates.lat]
        },
        photos: files.map(file => ({ href: `https://storage.googleapis.com/${bucketName}/${file.name}` })),
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
        photosToAdd = [{ href: `https://storage.googleapis.com/${bucketName}/${files.name}` }]
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
        photosToAdd = files.map(file => ({ href: `https://storage.googleapis.com/${bucketName}/${file.name}` }));
        //delete local photo files after upload to google 
        files.forEach(file => fs.unlink(`./uploads/images/${file.name}`, err => {if(err) console.log(err)}))
    }

    if(toBeDeleted && toBeDeleted.length > 0) {
        const photoFileNames = toBeDeleted.map(fullUrl => fullUrl.split(`${bucketName}/`)[1]);
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

    const photoFileNames = property.photos.map(photo => photo.href.split(`${bucketName}/`)[1]);
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

