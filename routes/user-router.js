"use strict";

const express = require("express");
const router = express.Router();
const csrf = require("csurf");

const csrfProtection = csrf();
// Use csrf middleware in all user-router routes
router.use(csrfProtection);

// GET Sign Up
router.get("/signup", (req, res) => {
    res.render("user/signup", { title: "Sign Up", csrfToken: req.csrfToken() });
});

router.post("/signup", (req, res) => {
    try {
        
    } catch (err) {
        console.error(err);

        res.render("user/signup", { title: "Sign Up", error: err });
    }
});

// GET Log In
router.get("/login", (req, res) => {
    res.render("user/login", { title: "Log In" });
});

module.exports = router;