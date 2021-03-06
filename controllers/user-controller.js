"use strict";

const bcrypt = require("bcrypt");

const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { signupValidation } = require("../validation/validate-user");

const getSignup = (req, res) => {
    res.render("user/signup", { title: "Sign Up" });
};

const postSignup = async (req, res) => {
    try {
        // Validate incoming data
        await signupValidation(req.body);

    } catch (err) {
        return res.render("user/signup", { title: "Sign Up", error: err.details[0].message });
    }

    try {
        const { first_name, last_name, email, password } = req.body;

        // Check if user is already in db
        const emailExists = await User.findOne({ email }).lean();

        if (emailExists) {
            return res.render("user/signup", { title: "Sign Up", error: "Email already exists" });
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

        res.render("user/signup", { title: "Sign Up", error: err });
    }
};

const getLogin = (req, res) => {
    res.render("user/login", { title: "Log In" });
};

const postLogin = (req, res, next) => {
    if (req.session.oldUrl) {
        const oldUrl = req.session.oldUrl;

        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect("/user/profile");
    }
}

const getProfile = async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user._id }).sort({ created_at: -1 });

        for (let order of orders) {
            const cart = new Cart(order.cart);
            order.items = cart.generateArray();
        }
        
        res.render("user/profile", { title: "Profile", user: req.user, orders: orders });

    } catch (err) {
        console.error(err);

        res.render("user/profile", { title: "Profile", user: req.user, error: err.message });
    }
};

const getLogout = (req, res) => {
    req.logOut();
    res.redirect("/");
};

module.exports = {
    getSignup,
    postSignup,
    getLogin,
    postLogin,
    getProfile,
    getLogout
};