"use strict";

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET Page Views
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().lean();

        res.render("shop/index", { title: "Home", products, genre: "all" });
        
    } catch (err) {
        console.error(err);

        res.render("shop/index", { title: "Home", error: err.message });
    }
});

router.get("/games/action", async (req, res) => {
    try {
        const products = await Product.find({ genre: "action" }).lean();

        res.render("shop/index", { title: "Home", products, genre: "action" });
        
    } catch (err) {
        console.error(err);

        res.render("shop/index", { title: "Home", error: err.message });
    }
});

router.get("/games/adventure", async (req, res) => {
    try {
        const products = await Product.find({ genre: "adventure" }).lean();

        res.render("shop/index", { title: "Home", products, genre: "adventure" });
        
    } catch (err) {
        console.error(err);

        res.render("shop/index", { title: "Home", error: err.message });
    }
});

router.get("/games/rpg", async (req, res) => {
    try {
        const products = await Product.find({ genre: "rpg" }).lean();

        res.render("shop/index", { title: "Home", products, genre: "rpg" });
        
    } catch (err) {
        console.error(err);

        res.render("shop/index", { title: "Home", error: err.message });
    }
});

router.get("/games/sports", async (req, res) => {
    try {
        const products = await Product.find({ genre: "sports" }).lean();

        res.render("shop/index", { title: "Home", products, genre: "sports" });
        
    } catch (err) {
        console.error(err);

        res.render("shop/index", { title: "Home", error: err.message });
    }
});

// GET Single Product
router.get("/games/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        res.render("shop/product-page", { title: `${product.title} Details`, product, genre: product.genre });

    } catch (err) {
        console.error(err);

        res.render("shop/product-page", { title: req.params.id, error: err.message });
    }
});

module.exports = router;