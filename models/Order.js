"use strict";

const mongoose = require("mongoose");
// const moment = require("moment");

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
        return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(this.created_at);
        // return moment(this.created_at).format("MMMM Do, YYYY");
    });

module.exports = mongoose.model("Order", OrderSchema);