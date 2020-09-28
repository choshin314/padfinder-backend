const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const nodemailer = require('nodemailer');

const HttpError = require('../models/http-error');
const { uploadFile, deleteFiles, uploadFileStream, bucketName } = require('../util/google-storage');
const getCoordinates = require('../util/google-coordinates');
const { Property, validateProperty } = require('../models/property-model');
const { User } = require('../models/user-model');

//-------------------SEND EMAIL TO PROPERTY CREATOR--------------------------//
const sendListingInquiry = async (req, res, next) => {
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
}

//-------------------GET PROPERTIES NEAR GEOLOCATION OR SEARCHED LOCATION-----------//
const getNearby = async (req, res, next) => {
    let { queryString, lat, lng, limit = 100 } = req.query;
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
                    $maxDistance: 160000,
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(coordinates.lng), parseFloat(coordinates.lat)]
                    }
                }
            }
        }).limit(parseInt(limit))
    } catch(err) {
        console.log(err.message);
        const error = new HttpError('Error retrieving properties, please try again', 500);
        return next(error);
    }
    console.log(nearbyProperties)
    res.status(200).json({ nearbyProperties, formatted_address, coordinates });
}

//---------------------------GET SINGLE LISTING BY ID----------------------------------//
const getSingleListing = async (req, res, next) => {
    const propertyId = req.query.propertyId;
    try {
        const property = await Property.findById(propertyId);
        res.status(200).json(property);
    } catch(err) {
        const error = new HttpError(err.message, 500);
    }
}

//---------------------------CREATE NEW PROPERTY LISTING-------------------------------//
const createListing = async (req, res, next) => {
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
    try {
        for (const file of files) {
            await uploadFileStream(file, next);
        }
    } catch(err) {
        const error = new HttpError('Could not upload images, please try again later.', 500);
        return next(error);
    }
    
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
}

//-----------------------------UPDATE LISTING--------------------------//
const updateListing = async (req, res, next) => {
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
        try {
            await uploadFileStream(files, next);
        } catch(err) {
            const error = new HttpError('Could not upload images, please try again later.', 500);
            return next(error);
        }
        photosToAdd = [{ href: `https://storage.googleapis.com/${bucketName}/${files.name}` }]
    }

    if (files && Array.isArray(files)) {
        try {
            for (const file of files) {
                await uploadFileStream(file, next);
            }
        } catch(err) {
            const error = new HttpError('Could not upload images, please try again later.', 500);
            return next(error);
        }
        photosToAdd = files.map(file => ({ href: `https://storage.googleapis.com/${bucketName}/${file.name}` }));
    }

    if(toBeDeleted && toBeDeleted.length > 0) {
        const photoFileNames = toBeDeleted.map(fullUrl => fullUrl.split(`${bucketName}/`)[1]);
        try {
            await deleteFiles(photoFileNames, next);
        } catch(err) {
            console.log(err);
        }
    }
    //save changes to Property document
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
}


//-----------------------------------------------------------------------//
//--------------------------------DELETE LISTING-------------------------//

const deleteListing = async (req, res, next) => {
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
}


//-----------------------------------------------------------------------//
//---------------------------GET LISTINGS / FAVES------------------------//

const getPropertyList = async (req, res, next) => {
    const { listName, userId } = req.params;
    let { pg, limit } = req.query;
    pg = parseInt(pg);
    limit = parseInt(limit);
    const filter = listName === 'listings' ? { creator: userId } : { favorited_by: [userId] };
    let listData = {};
    try {
        listData.properties = await Property.find(filter).skip((pg - 1) * limit).limit(limit);
        listData.totalCount = await Property.countDocuments(filter);
        listData.totalPages = Math.ceil(listData.totalCount/limit);
        listData.currentPage = pg;
        listData.prevPage = pg > 1 ? pg - 1 : null;
        listData.nextPage = pg < listData.totalPages ? pg + 1 : null;
    } catch(err) {
        const error = new HttpError('Could not retrieve property list', 500);
        return next(error);
    }
    res.status(200).json(listData);
}

//-----------------------------------------------------------------------//
//-----------------------------ADD FAVORITES-----------------------------//

const addFavorite = async (req, res, next) => {
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
}

//-----------------------------------------------------------------------//
//--------------------------REMOVE FAVORITES-----------------------------//

const removeFavorite = async (req, res, next) => {
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
}


module.exports = {
    sendListingInquiry,
    getNearby,
    getSingleListing,
    createListing,
    updateListing,
    deleteListing,
    getPropertyList,
    addFavorite,
    removeFavorite
}