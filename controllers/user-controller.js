"use strict";

const bcrypt = require("bcrypt");

const User = require("../models/User");
const Order = require("../models/Order");
const { cartCalculateQuantity, cartCalculateTotal, cartItemsInitialize } = require("../models/Cart");
const { signupValidation } = require("../validation/validate-user");
const { GENERIC_ERR_MSG } = require("../utils/generic-err-msg");

const getSignup = (req, res) => {
    const cartItems = cartItemsInitialize(req.session.cart);
    const cartTotalQuantity = cartCalculateQuantity(cartItems);

    res.render("user/signup", { title: "Sign Up", cartTotalQuantity });
};

const postSignup = async (req, res) => {
    const cartItems = cartItemsInitialize(req.session.cart);
    const cartTotalQuantity = cartCalculateQuantity(cartItems);

    try {
        // Validate incoming data
        await signupValidation(req.body);

    } catch (err) {
        return res.render("user/signup", { title: "Sign Up", error: err.details[0].message, cartTotalQuantity });
    }

    try {
        const { first_name, last_name, email, password } = req.body;

        // Check if user is already in db
        const emailExists = await User
                                    .findOne({ email })
                                    .lean()
                                    .setOptions({ sanitizeFilter: true });

        if (emailExists) {
            return res.render("user/signup", { title: "Sign Up", error: "Email already exists", cartTotalQuantity });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const user = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.redirect("/user/login");
        
    } catch (err) {
        console.error(err);

        res.render("user/signup", { title: "Sign Up", error: GENERIC_ERR_MSG, cartTotalQuantity });
    }
};

const getLogin = (req, res) => {
    const cartItems = cartItemsInitialize(req.session.cart);
    const cartTotalQuantity = cartCalculateQuantity(cartItems);

    res.render("user/login", { title: "Log In", cartTotalQuantity });
};

const postLogin = (req, res, next) => {
    if (req.session.oldUrl) {
        const oldUrl = req.session.oldUrl;

        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect("/user/profile");
    }
};

const getProfile = async (req, res) => {
    const currentCartItems = cartItemsInitialize(req.session.cart);
    const currentCartTotalQuantity = cartCalculateQuantity(currentCartItems);

    try {
        let previousOrders = await Order
                                .find({ user_id: req.user._id })
                                .sort({ created_at: -1 })
                                .setOptions({ sanitizeFilter: true });

        for (let order of previousOrders) {
            const cartItems = order.cart;
            order.items = cartItems;
            order.cartTotal = cartCalculateTotal(cartItems);
        }
        
        res.render("user/profile", { title: "Profile", user: req.user, orders: previousOrders, cartTotalQuantity: currentCartTotalQuantity });

    } catch (err) {
        console.error(err);

        res.render("user/profile", { title: "Profile", user: req.user, error: GENERIC_ERR_MSG, cartTotalQuantity: currentCartTotalQuantity });
    }
};

const getLogout = (req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err);

        res.redirect("/");
    });
};

module.exports = {
    getSignup,
    postSignup,
    getLogin,
    postLogin,
    getProfile,
    getLogout
};