"use strict";

const mongoose = require("mongoose");

const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { gameValidation } = require("../validation/validate-game");
const { checkRatingExistence } = require("../utils/check-rating-existence");

const getGamesIndex = async (req, res) => {
    try {
        // Pagination
        const page = Number(req.query.page) || 1;
        const itemsPerPage = 9;
        const skipAmt = ((page - 1) * itemsPerPage);

        // Aggregate Option
        const productsAgg = await Product.aggregate([
            {
                $facet: {
                    "products_data": [
                        { $skip: skipAmt},
                        { $limit: itemsPerPage },
                        { $project: { description: 0, ratings: 0 } } // exclude description and ratings fields
                    ],
                    "total_products": [
                        {
                            $count: "products_count"
                        }
                    ]
                }
            }
        ]);

        const myProducts = productsAgg[0].products_data;
        const totalProducts = productsAgg[0].total_products[0].products_count;

        const hasNextPage = itemsPerPage * page < totalProducts;
        const hasPrevPage = page > 1;
        const nextPage = page + 1;
        const prevPage = page - 1;

        res.render("shop/index", {
            title: "Home",
            products: myProducts,
            hasNextPage,
            hasPrevPage,
            nextPage,
            prevPage,
            genre: "all",
            user: req.user
        });
        
    } catch (err) {
        console.error(err);

        res.render("shop/index", { title: "Home", error: err.message });
    }
};

const getGamesAction = async (req, res) => {
    try {
        const products = await Product.find({ genre: "action" }).select("-description -ratings").lean();

        res.render("shop/index", { title: "Home", products, genre: "action" });
        
    } catch (err) {
        console.error(err);

        res.render("shop/index", { title: "Home", error: err.message });
    }
};

const getGamesAdventure = async (req, res) => {
    try {
        const products = await Product.find({ genre: "adventure" }).select("-description -ratings").lean();

        res.render("shop/index", { title: "Home", products, genre: "adventure" });
        
    } catch (err) {
        console.error(err);

        res.render("shop/index", { title: "Home", error: err.message });
    }
};

const getGamesRpg = async (req, res) => {
    try {
        const products = await Product.find({ genre: "rpg" }).select("-description -ratings").lean();

        res.render("shop/index", { title: "Home", products, genre: "rpg" });
        
    } catch (err) {
        console.error(err);

        res.render("shop/index", { title: "Home", error: err.message });
    }
};

const getGamesSports = async (req, res) => {
    try {
        const products = await Product.find({ genre: "sports" }).select("-description -ratings").lean();

        res.render("shop/index", { title: "Home", products, genre: "sports" });
        
    } catch (err) {
        console.error(err);

        res.render("shop/index", { title: "Home", error: err.message });
    }
};

const getGame = async (req, res) => {
    try {
        const { id } = req.params;
        const prodId = mongoose.Types.ObjectId(id);
        const prod = await Product.aggregate([
            {
                $match: { _id: prodId }
            },
            {
                $unwind: {
                    "path": "$ratings",
                    "preserveNullAndEmptyArrays": true // still returns a document if ratings field is empty
                }
            },
            {
                $group: {
                    _id: "$_id",
                    title: { $first: "$title" },
                    genre: { $first: "$genre" },
                    price: { $first: "$price" },
                    description: { $first: "$description" },
                    img_path: { $first: "$img_path" },
                    avgRating: { $avg: "$ratings.user_rating" },
                    ratings: { $push: "$ratings" },
                    totalRatings: { $sum: 1 }
                }
            }
        ]);
        const product = prod[0];
        // TODO
        // Check for existing rating
        const currUserId = req.user ? req.user._id.toString() : null;
        const productRatingsArr = product.ratings;
        
        const currUserRatingExists = checkRatingExistence(currUserId, productRatingsArr);

        // No game ratings yet? Output regular game data
        if (product.avgRating === null) {
            return res.render("shop/product-page", { title: `${product.title} Details`, product, genre: product.genre, noAverageRating: "No ratings yet."});
        }

        // Otherwise, output game data, rating, and num of ratings
        res.render("shop/product-page", {
            title: `${product.title} Details`,
            product,
            genre: product.genre,
            averageRating: product.avgRating,
            totalRatings: product.totalRatings,
            currUserRatingExists
        });

    } catch (err) {
        console.error(err);

        res.render("shop/product-page", { title: req.params.id, error: err.message });
    }
};

const getAddToCart = async (req, res) => {
    try {
        const productId = req.params.id;
        // If a cart is already in the session retrieve the old cart, otherwise pass a new obj
        const cart = new Cart(req.session.cart ? req.session.cart : {});

        const product = await Product.findById(productId);

        cart.add(product, product.id);
        req.session.cart = cart;

        res.redirect("/");
        
    } catch (err) {
        console.error(err);
    }
};

const postAddRating = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).select("ratings");
        const newRating = {
            user_id: req.user._id,
            user_rating: req.body.rating
        };

        product.ratings.push(newRating);

        await product.save();

        res.redirect(`/games/${productId}`);

    } catch (err) {
        console.error(err);

        res.render("shop/product-page", { title: req.params.id, error: err.message });
    }
};

const getAddGame = (req, res) => {
    res.render("admin/add-game", { title: "New Game" });
};

const postAddGame = async (req, res) => {
    try {
        await gameValidation(req.body);

    } catch (err) {
        return res.render("admin/add-game", { title: "New Game", error: err.details[0].message });
    }

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
};

const getUpdateGame = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).lean();
    
        res.render("admin/update-game", { title: "Update Game", product: product });
        
    } catch (err) {
        console.error(err);

        res.render("admin/update-game", { title: "Update Game", product: product, error: err });
    }
};

const patchUpdateGame = async (req, res) => {
    try {
        await gameValidation(req.body);

    } catch (err) {
        return res.render("admin/update-game", { title: "Update Game", error: err.details[0].message });
    }

    try {
        const { id } = req.params;
        const { title, genre, price, description, img_path } = req.body;
        const updatedProductInfo = {
            title,
            genre,
            price,
            description,
            img_path
        };

        await Product.findByIdAndUpdate(id, updatedProductInfo);
    
        res.redirect(`/games/${id}`);
        
    } catch (err) {
        console.error(err);

        res.render("admin/update-game", { title: "Update Game", product: product, error: err });
    }
};

const deleteGame = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);

        res.redirect("/");

    } catch (err) {
        console.error(err);

        res.render("shop/product-page", { title: req.params.id, error: err.message });
    }
};

module.exports = {
    getGamesIndex,
    getGamesAction,
    getGamesAdventure,
    getGamesRpg,
    getGamesSports,
    getGame,
    getAddToCart,
    postAddRating,
    getAddGame,
    postAddGame,
    getUpdateGame,
    patchUpdateGame,
    deleteGame
};