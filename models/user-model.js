const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Joi = require('@hapi/joi');

const userSchema = new mongoose.Schema({
    email: { type: String, lowercase: true, required: true, minlength: 5, maxlength: 50, unique: true },
    password: { type: String, required: true },
    isLister: { type: Boolean, required: true },
    first_name: { type: String, minlength: 2 },
    last_name: { type: String, minlength: 2 },
    company: { type: String },
    phone: { type: String, minlength: 10, maxlength: 10 },
})

userSchema.plugin(uniqueValidator);

const User = new mongoose.model('User', userSchema);

function validateUser(user) {
    const validationSchema = Joi.object({
        email: Joi.string().email().min(5).max(50).required(),
        password: Joi.string(),
        isLister: Joi.boolean().required(),
        first_name: Joi.string().min(2),
        last_name: Joi.string().min(2),
        company: Joi.string(),
        phone: Joi.string().length(10)
    })
}

module.exports = { User, userSchema, validateUser }