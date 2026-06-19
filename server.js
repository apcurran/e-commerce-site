import express from "express";
import expressLayouts from "express-ejs-layouts";
import mongoose from "mongoose";
import methodOverride from "method-override";
import flash from "express-flash";
import session from "express-session";
import passport from "passport";
import { MongoStore } from "connect-mongo";
import helmet from "helmet";
import csrf from "@dr.pogodin/csurf";

import { GENERIC_ERR_MSG } from "./utils/generic-err-msg.js";
import gamesRouter from "./routes/games-router.js";
import userRouter from "./routes/user-router.js";
import adminRouter from "./routes/admin-router.js";
import checkoutRouter from "./routes/checkout-router.js";
// Initialize Passport
import "./config/passport-config.js";

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

// Routers
const app = express();

// dev environment only
if (!isProduction) {
    // top-level await async import
    const { default: morgan } = await import("morgan");
    app.use(morgan("dev"));
}

// DB Setup
mongoose
    .connect(process.env.DB_URI)
    .catch((err) => console.error(`Mongo error: ${err}`));

// reduce fingerprinting
app.disable("x-powered-by");

// Middleware
// allow Stripe API and Google Fonts to load properly
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                scriptSrc: ["'self'", "https://js.stripe.com"],
                frameSrc: [
                    "'self'",
                    "https://js.stripe.com",
                    "https://hooks.stripe.com",
                ],
                connectSrc: [
                    "'self'",
                    "https://api.stripe.com",
                    "https://hooks.stripe.com",
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://fonts.googleapis.com",
                ],
                styleSrcElem: ["'self'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: [
                    "'self'",
                    "data:",
                    "https://*.stripe.com",
                    "https://res.cloudinary.com",
                ],
            },
        },
    }),
);
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressLayouts);

if (!isProduction) {
    // Disable caching
    app.use(express.static("public"));
} else {
    // Enable 1 day caching of static assets
    app.use(express.static("public", { maxAge: "1d" }));
    // trust first proxy for cookie secure option to work properly
    app.set("trust proxy", 1);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(flash());
// expires option should not be set directly; only use the maxAge option
let cookieOptions = {
    maxAge: 120 * 60 * 1000,
    httpOnly: true,
    path: "/",
};

if (isProduction) {
    cookieOptions = {
        ...cookieOptions, // utilize base cookie options, then add more on top
        secure: true,
        domain: process.env.COOKIE_DOMAIN,
    };
}

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        name: process.env.SESSION_NAME,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.DB_URI,
        }),
        cookie: cookieOptions,
    }),
);
// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
// Enable csrfProtection
const csrfProtection = csrf();
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

    res.status(500).render("error", {
        title: "Server Error",
        error: GENERIC_ERR_MSG,
    });
});

app.listen(PORT, () => console.log(`Server running on port, ${PORT}.`));
