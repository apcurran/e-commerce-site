"use strict";

const Joi = require("@hapi/joi");

function gameValidation(data) {
    const schema = Joi.object({
        title: Joi
                .string()
                .min(1)
                .required(),
        genre: Joi
                .string()
                .min(1)
                .required(),
        price: Joi
                .number()
                .required(),
        description: Joi
                .string()
                .min(1)
                .required(),
        img_path: Joi
                .string()
                .min(1)
                .required(),
        
    });

    return schema.validateAsync(data);
}

module.exports = { gameValidation };