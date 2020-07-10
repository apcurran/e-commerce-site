"use strict";

const express = require("express");
const router = express.Router();

// GET Sign Up
router.get("/signup", (req, res) => {
    res.render("user/signup", { title: "Sign Up" });
});

// GET Log In
router.get("/login", (req, res) => {
    res.render("user/login", { title: "Log In" });
});

module.exports = router;