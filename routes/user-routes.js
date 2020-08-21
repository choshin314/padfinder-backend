const express = require('express');
const router = express.Router();

//register new user

let users = [
    {
        id: "1",
        email: "john@test.com",
        password: "password",
        lister: false
    },
    {
        id: "2",
        email: "bob@test.com",
        password: "password",
        lister: true,
        first_name: "Bob",
        last_name: "Smith",
        company: "Bob Smith Properties",
        phone: "1234567890"
    },
    {
        id: "3",
        email: "jim@test.com",
        password: "password",
        lister: true,
        first_name: "Jim",
        last_name: "Jimmerson",
        company: "Jim Jimmerson Properties",
        phone: "2345678901"
    }
]

router.post('/register', (req, res, next) => {
    let {email, password, lister, first_name, last_name, company, phone} = req.body;
    let existingUser = users.find(u => u.email === email);
    if (existingUser) return res.status(400).send('User already exists');
    let newUser = {
        id: users.length + 1,
        email,
        password,
        lister,
        first_name,
        last_name,
        company,
        phone
    }
    users.push(newUser);
    res.json(newUser);
})

router.get('/', (req, res, next) => {
    res.json(users)
})

module.exports = router;