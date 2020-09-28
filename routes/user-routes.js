const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/user-controllers')

//register new user
router.post('/register', registerUser)

// log in
router.post('/login', loginUser)

module.exports = router;