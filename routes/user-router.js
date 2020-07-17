"use strict";

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const { checkNotAuthenticated, checkAuthenticated } = require("../config/check-auth");
const { signupValidation, loginValidation } = require("../validation/validate-user");
const passport = require("passport");
const csrf = require("csurf");

const csrfProtection = csrf();
// Use csrf middleware in all user-router routes
router.use(csrfProtection);

// GET Sign Up
router.get("/signup", checkNotAuthenticated, (req, res) => {
    res.render("user/signup", { title: "Sign Up", csrfToken: req.csrfToken() });
});

router.post("/signup", checkNotAuthenticated, async (req, res) => {
    try {
        // Validate incoming data
        await signupValidation(req.body);

    } catch (err) {
        return res.render("user/signup", { title: "Sign Up", csrfToken: req.csrfToken(), error: err.details[0].message });
    }

    try {
        const { first_name, last_name, email, password } = req.body;

        // Check if user is already in db
        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.render("user/signup", { title: "Sign Up", csrfToken: req.csrfToken(), error: "Email already exists" });
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

        res.render("user/signup", { title: "Sign Up", csrfToken: req.csrfToken(), error: err });
    }
});

// GET Log In
router.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("user/login", { title: "Log In", csrfToken: req.csrfToken() });
});

router.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    // successRedirect: "/user/profile",
    failureRedirect: "/user/login",
    failureFlash: true
}), (req, res, next) => {
    if (req.session.oldUrl) {
        const oldUrl = req.session.oldUrl;

        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect("/user/profile");
    }
});

// GET User Profile
router.get("/profile", checkAuthenticated, async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user._id });

        for (let order of orders) {
            const cart = new Cart(order.cart);
            order.items = cart.generateArray();
        }
        
        res.render("user/profile", { title: "Profile", user: req.user, orders: orders });

    } catch (err) {
        console.error(err);

        res.render("user/profile", { title: "Profile", user: req.user, error: err.message });
    }

});

// GET Log Out
router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});

module.exports = router;