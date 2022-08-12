"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");
const adminController = require("../controllers/admin-controller");
const { checkNotAuthenticated } = require("../config/check-auth");

// GET Admin Log In
router.get("/login", checkNotAuthenticated, adminController.getLogin);

// POST Admin Log In
router.post("/login", checkNotAuthenticated, passport.authenticate("local.adminLogin", {
    failureRedirect: "/admin/login",
    failureFlash: true,
    keepSessionInfo: true // preserve session state
}), adminController.postLogin);

// GET Admin Sign Up
router.get("/signup", checkNotAuthenticated, adminController.getSignup);

// POST Admin Sign Up
router.post("/signup", checkNotAuthenticated, adminController.postSignup);

module.exports = router;