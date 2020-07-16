"use strict";

const express = require("express");
const passport = require("passport");

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    req.session.oldUrl = req.url;

    return res.redirect("/user/login");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }

    return next();
}

module.exports = { checkAuthenticated, checkNotAuthenticated };