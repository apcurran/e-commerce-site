"use strict";

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    first_name: { type: String, min: 1, max: 200, required: true },
    last_name: { type: String, min: 1, max: 200, required: true },
    email: { type: String, min: 1, max: 100, required: true },
    password: { type: String, min: 6, max: 100, required: true },
    admin: { type: Boolean, default: false },
    admin_secret: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
