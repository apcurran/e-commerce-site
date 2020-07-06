"use strict";

const express = require("express");
const PORT = process.env.PORT || 5000;
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const app = express();

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// Middleware
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Routes

// Final 404 route handler
app.use((req, res, next) => {
    res.status(404).render("404", { title: "404 Not Found" });
});

app.listen(PORT, () => console.log(`Server running on port, ${PORT}.`));