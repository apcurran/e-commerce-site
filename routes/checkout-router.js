"use strict";

const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { checkAuthenticated } = require("../config/check-auth");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/checkout-preview", (req, res) => {
    if (!req.session.cart) {
        return res.render("shop/checkout-preview", { title: "Checkout Preview" });
    }

    const cart = new Cart(req.session.cart);

    res.render("shop/checkout-preview", { title: "Checkout Preview", products: cart.generateArray(), totalPrice: cart.totalPrice });
});

// Checkout-preview add one instance of an item to cart
router.get("/increase/:id", (req, res) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.incrementByOne(productId);

    req.session.cart = cart;

    res.redirect("/checkout-preview");
});

// Checkout-preview remove one instance of an item from cart
router.get("/reduce/:id", (req, res) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);

    req.session.cart = cart;

    res.redirect("/checkout-preview");
});

// Checkout-preview remove one item and all of its quantity from cart
router.get("/remove/:id", (req, res) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);

    req.session.cart = cart;

    res.redirect("/checkout-preview");
});

router.get("/checkout", checkAuthenticated, (req, res) => {
    if (!req.session.cart) {
        return res.redirect("/checkout-preview");
    }

    const cart = new Cart(req.session.cart);

    res.render("shop/checkout", { title: "Checkout", total: cart.totalPrice });
});

router.post("/api/create-payment-intent", checkAuthenticated, async (req, res) => {
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

router.post("/api/successful-order", checkAuthenticated, async (req, res) => {
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