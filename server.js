"use strict";

require("dotenv").config();

const express = require("express");
const PORT = process.env.PORT || 5000;
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const shrinkRay = require("shrink-ray-current");
const helmet = require("helmet");
const csrf = require("csurf");

const { GENERIC_ERR_MSG } = require("./utils/generic-err-msg");

// Initialize Passport
require("./config/passport-config");

// Routers
const gamesRouter = require("./routes/games-router");
const userRouter = require("./routes/user-router");
const adminRouter = require("./routes/admin-router");
const checkoutRouter = require("./routes/checkout-router");

const app = express();

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// DB Setup
mongoose
    .connect(process.env.DB_URI, { autoIndex: false })
    .catch((err) => console.error(`Mongo error:, ${err}`));

// csrf
const csrfProtection = csrf();
// reduce fingerprinting
app.disable("x-powered-by");

// Middleware
app.use(helmet());
app.use(shrinkRay());
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressLayouts);

if (process.env.NODE_ENV !== "production") {
    // Disable caching
    app.use(express.static("public"));
} else {
    // Enable 2 day caching of static assets
    app.use(express.static("public", { maxAge: "2d" }));
    // trust first proxy for cookie secure option to work properly
    app.set("trust proxy", 1);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(flash());
// expires option should not be set directly; only use the maxAge option
const devCookieOptions = {
    maxAge: 120 * 60 * 1000
};
const prodCookieOptions = {
    maxAge: 120 * 60 * 1000,
    secure: true,
    httpOnly: true,
    domain: process.env.COOKIE_DOMAIN,
    path: "/"
};
app.use(session({
    secret: process.env.SESSION_SECRET,
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: process.env.NODE_ENV === "dev" ? devCookieOptions : prodCookieOptions
}));
// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
// Enable csrfProtection
app.use(csrfProtection);

// Global views variables
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.session = req.session;
    res.locals.csrfToken = req.csrfToken();

    next();
});

// Routes
app.use("/", gamesRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/", checkoutRouter);

// 404 page
app.use((req, res, next) => {
    res.status(404).render("404", { title: "404 Not Found" });
});
// Final catch-all error page
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).render("error", { title: "Server Error", error: GENERIC_ERR_MSG });
});

app.listen(PORT, () => console.log(`Server running on port, ${PORT}.`));
