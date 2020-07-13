"use strict";

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { checkNotAuthenticated } = require("../config/check-auth");
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
router.get("/login",  checkNotAuthenticated, (req, res) => {
    res.render("user/login", { title: "Log In", csrfToken: req.csrfToken() });
});

router.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true
}));

// GET Log Out
router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});

module.exports = router;