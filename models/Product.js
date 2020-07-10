"use strict";

const mongoose = require("mongoose");

const RatingsSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    user_rating: { type: Number, required: true }
});

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    price: { type: Number, min: 1, required: true },
    description: { type: String, required: true },
    img_path: { type: String, required: true },
    ratings: [RatingsSchema]
});

module.exports = mongoose.model("Product", ProductSchema);