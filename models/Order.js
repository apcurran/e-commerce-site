"use strict";

const mongoose = require("mongoose");
const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

const OrderSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    cart: { type: Object, required: true },
    payment_id: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

OrderSchema
    .virtual("dateFormatted")
    .get(function() {
        return dateFormatter.format(this.created_at);
    });

module.exports = mongoose.model("Order", OrderSchema);