"use strict";

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

function checkAdminAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        return next();
    }

    req.session.oldUrl = req.url;

    return res.redirect("/admin/login");
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    checkAdminAuthenticated,
};
