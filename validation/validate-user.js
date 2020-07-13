"use strict";

const Joi = require("@hapi/joi");

function signupValidation(data) {
    const schema = Joi.object({
        first_name: Joi
                .string()
                .min(1)
                .required(),
        last_name: Joi
                .string()
                .min(1)
                .required(),
        email: Joi
                .string()
                .min(4)
                .email()
                .required(),
        password: Joi
                .string()
                .min(6)
                .required(),
        admin_secret: Joi
                .string()
    });

    return schema.validateAsync(data);
}

function loginValidation(data) {
    const schema = Joi.object({
        email: Joi
                .string()
                .min(4)
                .email()
                .required(),
        password: Joi
                .string()
                .min(6)
                .required(),
        _csrf: Joi
                .string()
    });

    return schema.validateAsync(data);
}

module.exports = { signupValidation, loginValidation };