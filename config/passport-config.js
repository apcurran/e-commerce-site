"use strict";

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");

async function authenticateUser(email, password, done) {
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

passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, authenticateUser));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});