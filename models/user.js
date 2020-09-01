const mongoose = require('mongoose')
const Joi = require('@hapi/joi');

const userSchema = new mongoose.Schema({
    email: { type: String, lowercase: true, required: true, minlength: 5, maxlength: 50 },
    password: { type: String, required: true },
    isLister: { type: Boolean, required: true },
    firstName: { type: String, lowercase: true, minlength: 2 },
    lastName: { type: String, lowercase: true, minlength: 2 },
    company: { type: String, lowercase: true },
    phone: { type: String, minlength: 10, maxlength: 10 },
})

const User = new mongoose.model('User', userSchema);

function validateUser(user) {
    const validationSchema = Joi.object({
        email: Joi.string().email().min(5).max(50).required(),
        password: Joi.string(),
        isLister: Joi.boolean().required(),
        firstName: Joi.string().min(2),
        lastName: Joi.string().min(2),
        company: Joi.string(),
        phone: Joi.string().length(10)
    })
}

module.exports = { User, userSchema, validateUser }