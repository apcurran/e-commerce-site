"use strict";

require('dotenv').config()
const express = require("express");
const PORT = process.env.PORT || 5000;
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
// Routers
const gamesRouter = require("./routes/games-router");
const userRouter = require("./routes/user-router");

const app = express();

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// DB Setup
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

// Middleware
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(flash());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", gamesRouter);
app.use("/user", userRouter);

// Final 404 route handler
app.use((req, res, next) => {
    res.status(404).render("404", { title: "404 Not Found" });
});

app.listen(PORT, () => console.log(`Server running on port, ${PORT}.`));