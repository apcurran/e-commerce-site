"use strict";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const { cartItemsInitialize, cartRemoveItem, cartIncrementByOne, cartDecrementByOne, cartCalculateTotal, cartCalculateQuantity } = require("../models/Cart");
const Order = require("../models/Order");

const getCheckoutPreview = (req, res) => {
    if (!req.session.cart) {
        return res.render("shop/checkout-preview", { title: "Checkout Preview", cartTotalQuantity: 0 });
    }

    const cartItems = req.session.cart;
    const cartTotalQuantity = cartCalculateQuantity(cartItems);
    const cartTotal = cartCalculateTotal(cartItems);

    res.render("shop/checkout-preview", { title: "Checkout Preview", cartItems, totalPrice: cartTotal, cartTotalQuantity });
};

const postIncrease = (req, res) => {
    const productId = req.params.id;
    const cartItems = cartItemsInitialize(req.session.cart);
    const updatedCart = cartIncrementByOne(cartItems, productId);
    req.session.cart = updatedCart;

    res.redirect("/checkout-preview");
};

const postReduce = (req, res) => {
    const productId = req.params.id;
    const cartItems = cartItemsInitialize(req.session.cart);
    const updatedCart = cartDecrementByOne(cartItems, productId);
    req.session.cart = updatedCart;

    res.redirect("/checkout-preview");
};

const postRemove = (req, res) => {
    const productId = req.params.id;
    const cartItems = cartItemsInitialize(req.session.cart);
    const updatedCart = cartRemoveItem(cartItems, productId);
    req.session.cart = updatedCart;

    res.redirect("/checkout-preview");
};

const getCheckout = (req, res) => {
    // reload the page if the cart is empty
    if (!req.session.cart) {
        return res.redirect("/checkout-preview");
    }

    const cartItems = req.session.cart;
    const cartTotalQuantity = cartCalculateQuantity(cartItems);
    const cartTotal = cartCalculateTotal(cartItems);

    res.render("shop/checkout", { title: "Checkout", total: cartTotal, cartTotalQuantity });
};

const postApiCreatePaymentIntent = async (req, res, next) => {
    try {
        if (!req.session.cart) {
            return res.redirect("/checkout-preview");
        }

        const cartItems = req.session.cart;
        const cartTotal = cartCalculateTotal(cartItems);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: cartTotal * 100,
          currency: "usd"
        });

        res.send({ clientSecret: paymentIntent.client_secret });
        
    } catch (err) {
        next(err);
    }
};

const postApiSuccessfulOrder = async (req, res, next) => {
    try {
        const cart = req.session.cart;
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
        next(err);
    }
};

module.exports = {
    getCheckoutPreview,
    postIncrease,
    postReduce,
    postRemove,
    getCheckout,
    postApiCreatePaymentIntent,
    postApiSuccessfulOrder
};