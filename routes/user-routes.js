const express = require('express');
const router = express.Router();
const HttpError = require('../models/http-error');
const { check, validationResult } = require('express-validator');

//register new user

let users = [
    {
        id: "1",
        email: "john@test.com",
        password: "password",
        isLister: false
    },
    {
        id: "2",
        email: "bob@test.com",
        password: "password",
        isLister: true,
        first_name: "Bob",
        last_name: "Smith",
        company: "Bob Smith Properties",
        phone: "1234567890"
    },
    {
        id: "3",
        email: "jim@test.com",
        password: "password",
        isLister: true,
        first_name: "Jim",
        last_name: "Jimmerson",
        company: "Jim Jimmerson Properties",
        phone: "2345678901"
    }
]



router.post(
    '/register', 
    [
        check('email').isEmail(),
        check('password').isLength({min: 8})
    ], 
    (req, res, next) => {
        //check if req.body.email is valid email & password is min-length 8
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            console.log(validationErrors);
            throw new HttpError('Invalid inputs passed, please check your data.', 422);
        }

        let {email, password, isLister, first_name, last_name, company, phone} = req.body;
        let existingUser = users.find(u => u.email === email);
        if (existingUser) return res.status(400).json('User already exists');
        let newUser = {
            id: users.length + 1,
            email,
            password,
            isLister,
            first_name,
            last_name,
            company,
            phone
        }
        users.push(newUser);
        res.json({
            id: newUser.id,
            phone: newUser.phone,
            company: newUser.company,
            email: newUser.email,
            isLister: newUser.isLister
        });
})

// log in
router.post('/login', (req, res, next) => {
    let {email, password} = req.body;
    console.log(req.body);
    let matchedUser = users.find(u => {
        return ((u.email.toLowerCase() === email.toLowerCase()) && (u.password === password))
    });
    if (!matchedUser) return res.status(400).json('Invalid email and/or password');
    res.json({
        id: matchedUser.id,
        phone: matchedUser.phone,
        company: matchedUser.company,
        email: matchedUser.email,
        isLister: matchedUser.isLister
    });
})

router.get('/', (req, res, next) => {
    res.json(users)
})

module.exports = router;