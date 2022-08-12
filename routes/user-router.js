"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user-controller");
const { checkNotAuthenticated, checkAuthenticated } = require("../config/check-auth");

// GET Sign Up
router.get("/signup", checkNotAuthenticated, userController.getSignup);

router.post("/signup", checkNotAuthenticated, userController.postSignup);

// GET Log In
router.get("/login", checkNotAuthenticated, userController.getLogin);

router.post("/login", checkNotAuthenticated, passport.authenticate("local.login", {
    failureRedirect: "/user/login",
    failureFlash: true,
    keepSessionInfo: true // preserve session state
}), userController.postLogin);

// GET User Profile
router.get("/profile", checkAuthenticated, userController.getProfile);

// GET Log Out
router.get("/logout", userController.getLogout);

module.exports = router;