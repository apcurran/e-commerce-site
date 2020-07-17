"use strict";

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { checkAdminAuthenticated } = require("../config/check-auth");

// GET Page Views
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().lean();

        res.render("shop/index", { title: "Home", products, genre: "all", user: req.user });
        
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

// GET Add game to cart
router.get("/add-to-cart/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        // If a cart is already in the session retrieve the old cart, otherwise pass a new obj
        const cart = new Cart(req.session.cart ? req.session.cart : {});

        const product = await Product.findById(productId);

        cart.add(product, product.id);
        req.session.cart = cart;

        console.log(req.session.cart);

        res.redirect("/");
        
    } catch (err) {
        console.error(err);
    }
});

// ADMIN PROTECTED ROUTES //

router.get("/game/add", checkAdminAuthenticated, (req, res) => {
    res.render("admin/add-game", { title: "New Game" });
});

router.post("/game/add", checkAdminAuthenticated, async (req, res) => {
    try {
        const { title, genre, price, description, img_path } = req.body;

        const product = new Product({
            title,
            genre,
            price,
            description,
            img_path
        });

        await product.save();

        res.redirect("/");

    } catch (err) {
        console.error(err);

        res.render("admin/add-game", { title: "New Game", error: err });
    }
});

module.exports = router;