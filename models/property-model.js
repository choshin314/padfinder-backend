const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const propertySchema = new mongoose.Schema({
    type: { type: String, required: true },
    available_date: { type: String, required: true },
    address: { 
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, minlength: 2, maxlength: 2, required: true },
        zip: { type: String, minlength: 5, maxlength: 5, required: true }
    },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    details: {
        rent: [{ type: Number, required: true }, { type: Number, required: true }],
        beds: [{ type: Number, required: true }, { type: Number, required: true }],
        baths: [{ type: Number, required: true }, { type: Number, required: true }],
        size: [{ type: Number, required: true }, { type: Number, required: true }],
        pet_policy: {
            dogs: { type: Boolean, required: true },
            cats: { type: Boolean, required: true }
        },
        neighborhood: String,
        laundry: String,
        utilities: String
    },
    photos: [{ href: String }],
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
})

const Property = mongoose.model('Property', propertySchema)

const validateProperty = (property) => {
    const validationSchema = Joi.object({
        type: Joi.string(),
        available_date: Joi.string().required(),
        address: {
            street: Joi.string().min(4).required(),
            city: Joi.string().min(2).required(),
            state: Joi.string().length(2).required(),
            zip: Joi.string().pattern(new RegExp('^[0-9]{5}$')).required()
        },
        details: {
            rent: Joi.array().items(Joi.number().integer().required()),
            beds: Joi.array().items(Joi.number().integer().required()),
            baths: Joi.array().items(Joi.number().required()),
            size: Joi.array().items(Joi.number().integer().required()),
            pet_policy: {
                dogs: Joi.boolean().required(),
                cats: Joi.boolean().required()
            },
            neighborhood: Joi.string(),
            laundry: Joi.string().required(),
            utilities: Joi.string().required(),
            parking: Joi.string().required(),
        },
        photos: Joi.array(),
        creator: Joi.string()
    })

    return validationSchema.validate(property)
}


module.exports = { Property, validateProperty }
