"use strict";

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getCheckoutPreview = (req, res) => {
    if (!req.session.cart) {
        return res.render("shop/checkout-preview", { title: "Checkout Preview" });
    }

    const cart = new Cart(req.session.cart);

    res.render("shop/checkout-preview", { title: "Checkout Preview", products: cart.generateArray(), totalPrice: cart.totalPrice });
};

const getIncrease = (req, res) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.incrementByOne(productId);

    req.session.cart = cart;

    res.redirect("/checkout-preview");
};

const getReduce = (req, res) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);

    req.session.cart = cart;

    res.redirect("/checkout-preview");
};

const getRemove = (req, res) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);

    req.session.cart = cart;

    res.redirect("/checkout-preview");
};

const getCheckout = (req, res) => {
    if (!req.session.cart) {
        return res.redirect("/checkout-preview");
    }

    const cart = new Cart(req.session.cart);

    res.render("shop/checkout", { title: "Checkout", total: cart.totalPrice });
};

const postApiCreatePaymentIntent = async (req, res) => {
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
};

const postApiSuccessfulOrder = async (req, res) => {
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
};

module.exports = {
    getCheckoutPreview,
    getIncrease,
    getReduce,
    getRemove,
    getCheckout,
    postApiCreatePaymentIntent,
    postApiSuccessfulOrder
};