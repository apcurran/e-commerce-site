"use strict";

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/checkout-preview", (req, res) => {
    if (!req.session.cart) {
        return res.render("shop/checkout-preview", { title: "Checkout Preview" });
    }

    const cart = new Cart(req.session.cart);

    res.render("shop/checkout-preview", { title: "Checkout Preview", products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get("/checkout", (req, res) => {
    if (!req.session.cart) {
        return res.redirect("/checkout-preview");
    }

    const cart = new Cart(req.session.cart);

    res.render("shop/checkout", { title: "Checkout", total: cart.totalPrice });
});

router.post("/api/create-payment-intent", async (req, res) => {
    try {
        if (!req.session.cart) {
            return res.redirect("/checkout-preview");
        }

        const cart = new Cart(req.session.cart);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: cart.totalPrice * 100,
          currency: "usd"
        });

        res.send({ clientSecret: paymentIntent.client_secret });
        
    } catch (err) {
        console.error(err);
    }
});

router.post("/api/successful-order", async (req, res) => {
    try {
        const cart = new Cart(req.session.cart);
        const order = new Order({
            user_id: req.user._id,
            cart: cart,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            payment_id: req.body.payment_id
        });
        
        await order.save();
        
        req.session.cart = null;
        res.status(201).end();

    } catch (err) {
        console.error(err);
    }
});

module.exports = router;