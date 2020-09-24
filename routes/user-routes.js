const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const { User, userSchema, validateUser } = require('../models/user-model')

//register new user

router.post('/register', async (req, res, next) => {
    const validationResult = validateUser(req.body);
    if (validationResult.error) {
        const error = new HttpError(validationResult.error.details[0].message, 422)
        return next(error); //if data fails Joi validation, kick this to the error handler middleware
    }

    let {email, password, isLister, first_name, last_name, company, phone} = req.body;
    
    //check if user account already exists
    let existingUser; 
    try {
        existingUser = await User.findOne( {email: email.toLowerCase()} )
    } catch (err) {
        const error = new HttpError('Registration failed.  Try again later.', 500)
        return next(error) //this is NOT to address user already existing.  This is to address if the process of checking if user exists fails
    }

    if (existingUser) {
        const error = new HttpError('User already exists', 422);
        return next(error);
    }

    //hash the password
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 8)
    } catch(err) {
        const error = new HttpError('Could not create user, please try again', 500)
        return next(error);
    }

    //create new user in the database
    const newUser = new User({
        email,
        password: hashedPassword,
        isLister,
        first_name: first_name ? first_name : undefined,
        last_name: last_name ? last_name : undefined,
        company: company ? company : undefined,
        phone: phone ? phone : undefined,
        listings: [],
        favorites: []
    })

    try {
        await newUser.save();
    } catch(err) {
        const error = new HttpError('Could not save new user', 500);
        return next(error);
    }
    
    //create jwt and send it back to client
    let token;
    try {
        token = await jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.SECRET_KEY
        ) 
    } catch(err) {
        const error = new HttpError('Registration failed, please try again later', 500)
        return next(error);
    }

    //send newUser properties + token back to client
    res.status(201).json({
        userId: newUser.id,
        email: newUser.email,
        isLister: newUser.isLister,
        token
    });
})

// log in
router.post('/login', async (req, res, next) => {
    let {email, password} = req.body;
    
    //find matching account by email
    let matchedUser;
    try {
        matchedUser = await User.findOne({ email: email })
    } catch(err) {
        const error = new HttpError('Could not log in', 500);
        return next(error);
    }

    //compare submitted password to hash
    let isPasswordValid;
    try {
        isPasswordValid = await bcrypt.compare(password, matchedUser.password);
        if (!isPasswordValid) throw new Error;
    } catch(err) {
        const error = new HttpError('Please check your credentials and try again', 403);
        return next(error);
    }

    //create jwt and send it back to client
    let token;
    try {
        token = await jwt.sign(
            { userId: matchedUser.id, email: matchedUser.email },
            process.env.SECRET_KEY
        ) 
    } catch(err) {
        const error = new HttpError('Log in failed, please try again later', 500)
        return next(error);
    }

    //send newUser properties + token back to client
    res.status(200).json({
        userId: matchedUser.id,
        email: matchedUser.email,
        isLister: matchedUser.isLister,
        token
    });
})

module.exports = router;