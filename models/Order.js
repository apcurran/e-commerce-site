"use strict";

const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    cart: { type: Object, required: true },
    payment_id: { type: String, required: true }
});

module.exports = mongoose.model("Order", OrderSchema);