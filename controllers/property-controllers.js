const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const fs = require('fs');
const nodemailer = require('nodemailer');

const verifyAuth = require('../middleware/authorization');
const HttpError = require('../models/http-error');
const { uploadFile, deleteFiles, bucketName } = require('../util/google-storage');
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


module.exports = {
    sendListingInquiry,
}