const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
    try {
        const products = await Product.find();

        res.render("shop/index", { title: "Home", products, genre: "all" });
        
    } catch (err) {
        console.error(err);

        res.render("shop/index", { title: "Home", error: err.message });
    }
});

router.get("/games/action", async (req, res) => {
    try {
        const products = await Product.find({ genre: "action" });

        res.render("shop/index", { title: "Home", products, genre: "action" });
        
    } catch (err) {
        console.error(err);

        res.render("shop/index", { title: "Home", error: err.message });
    }
});

router.get("/games/adventure", async (req, res) => {
    try {
        const products = await Product.find({ genre: "adventure" });

        res.render("shop/index", { title: "Home", products, genre: "adventure" });
        
    } catch (err) {
        console.error(err);

        res.render("shop/index", { title: "Home", error: err.message });
    }
});

router.get("/games/rpg", async (req, res) => {
    try {
        const products = await Product.find({ genre: "rpg" });

        res.render("shop/index", { title: "Home", products, genre: "rpg" });
        
    } catch (err) {
        console.error(err);

        res.render("shop/index", { title: "Home", error: err.message });
    }
});

router.get("/games/sports", async (req, res) => {
    try {
        const products = await Product.find({ genre: "sports" });

        res.render("shop/index", { title: "Home", products, genre: "sports" });
        
    } catch (err) {
        console.error(err);

        res.render("shop/index", { title: "Home", error: err.message });
    }
});

module.exports = router;