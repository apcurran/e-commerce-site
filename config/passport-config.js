"use strict";

const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");
const { loginValidation } = require("../validation/validate-user");

async function authenticateUser(req, email, password, done) {
    try {
        await loginValidation(req.body);

    } catch (err) {
        return done(null, false, { message: err.details[0].message });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return done(null, false, { message: "No user with that email." });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return done(null, false, { message: "Password incorrect" });
        }

        // Otherwise, the user is valid
        return done(null, user);
        
    } catch (err) {
        console.error(err);
        return done(err);
    }
}

async function authenticateAdmin(req, email, password, done) {
    try {
        await loginValidation(req.body);

    } catch (err) {
        return done(null, false, { message: err.details[0].message });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return done(null, false, { message: "No user with that email." });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return done(null, false, { message: "Password is incorrect." });
        }

        if (!user.admin) {
            return done(null, false, { message: "You are not an admin." });
        }

        // Otherwise, the user is valid
        return done(null, user);
        
    } catch (err) {
        console.error(err);
        return done(err);
    }
}

passport.use("local.login", new LocalStrategy({ usernameField: "email", passwordField: "password", passReqToCallback: true }, authenticateUser));
passport.use("local.adminLogin", new LocalStrategy({ usernameField: "email", passwordField: "password", passReqToCallback: true }, authenticateAdmin));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});