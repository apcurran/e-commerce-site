"use strict";

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

const { checkNotAuthenticated } = require("../config/check-auth");
const { signupValidation, loginValidation } = require("../validation/validate-user");
const passport = require("passport");

// GET Admin Log In
router.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("admin/login", { title: "Admin Log In" });
});

// POST Admin Log In
router.post("/login", checkNotAuthenticated, passport.authenticate("local.adminLogin", {
    failureRedirect: "/admin/login",
    failureFlash: true
}), (req, res, next) => {
    if (req.session.oldUrl) {
        const oldUrl = req.session.oldUrl;

        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect("/");
    }
});

// GET Admin Sign Up
router.get("/signup", checkNotAuthenticated, (req, res) => {
    res.render("admin/signup", { title: "Sign Up" });
});

// POST Admin Sign Up
router.post("/signup", checkNotAuthenticated, async (req, res) => {
    try {
        // Validate incoming data
        await signupValidation(req.body);

    } catch (err) {
        return res.render("admin/signup", { title: "Sign Up", error: err.details[0].message });
    }

    try {
        const { first_name, last_name, email, password, admin_secret } = req.body;

        // Check if user is already in db
        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.render("admin/signup", { title: "Sign Up", error: "Email already exists" });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Admin
        if (admin_secret !== process.env.ADMIN_SECRET) {
            return res.render("admin/signup", { title: "Sign Up", error: "Incorrect admin secret" });
        }

        // Create a new admin user
        const user = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            admin: true
        });

        await user.save();

        res.redirect("/admin/login");
        
    } catch (err) {
        console.error(err);

        res.render("admin/signup", { title: "Sign Up", error: err });
    }
});

module.exports = router;