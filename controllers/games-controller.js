"use strict";

const mongoose = require("mongoose");

const Product = require("../models/Product");
const {
    cartItemsInitialize,
    cartAddItem,
    cartCalculateQuantity,
} = require("../models/Cart");
const { gameValidation } = require("../validation/validate-game");
const { checkRatingExistence } = require("../utils/check-rating-existence");
const { GENERIC_ERR_MSG } = require("../utils/generic-err-msg");

const getGamesIndex = async (req, res) => {
    const cartItems = cartItemsInitialize(req.session.cart);
    const cartTotalQuantity = cartCalculateQuantity(cartItems);

    try {
        // Pagination
        const page = Number(req.query.page) || 1;
        const itemsPerPage = 9;
        const skipAmt = (page - 1) * itemsPerPage;

        // Aggregate Option
        const productsAgg = await Product.aggregate([
            {
                $facet: {
                    products_data: [
                        { $skip: skipAmt },
                        { $limit: itemsPerPage },
                        { $project: { description: 0, ratings: 0 } }, // exclude description and ratings fields
                    ],
                    total_products: [
                        {
                            $count: "products_count",
                        },
                    ],
                },
            },
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
            user: req.user,
            cartTotalQuantity,
        });
    } catch (err) {
        console.error(err);

        res.render("shop/index", {
            title: "Home",
            error: GENERIC_ERR_MSG,
            cartTotalQuantity,
        });
    }
};

const getGamesByGenre = async (req, res) => {
    const cartItems = cartItemsInitialize(req.session.cart);
    const cartTotalQuantity = cartCalculateQuantity(cartItems);
    const { genre } = req.params;

    try {
        const products = await Product.find({ genre })
            .select("-description -ratings")
            .lean();

        let viewErrorMessage = null;

        // pass an error to the view engine
        if (products.length === 0) {
            viewErrorMessage = `No games were found with the given ${genre} genre.`;
        }

        res.render("shop/index", {
            title: "Home",
            products,
            genre,
            error: viewErrorMessage,
            cartTotalQuantity,
        });
    } catch (err) {
        console.error(err);

        res.render("shop/index", {
            title: "Home",
            products: [],
            error: GENERIC_ERR_MSG,
            cartTotalQuantity,
        });
    }
};

const getGame = async (req, res) => {
    const cartItems = cartItemsInitialize(req.session.cart);
    const cartTotalQuantity = cartCalculateQuantity(cartItems);

    try {
        const { id } = req.params;
        const prodId = new mongoose.Types.ObjectId(id);
        const product = (
            await Product.aggregate([
                {
                    $match: { _id: prodId },
                },
                {
                    $unwind: {
                        path: "$ratings",
                        preserveNullAndEmptyArrays: true, // still returns a document if ratings field is empty
                    },
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
                        totalRatings: { $sum: 1 },
                    },
                },
            ])
        )[0];

        const currUserId = req.user ? req.user._id.toString() : null;
        const productRatingsArr = product.ratings;
        const currUserRatingExists = checkRatingExistence(
            currUserId,
            productRatingsArr,
        );

        // No game ratings yet? Output regular game data
        if (product.avgRating === null) {
            return res.render("shop/product-page", {
                title: `${product.title} Details`,
                product,
                genre: product.genre,
                noAverageRating: "No ratings yet.",
                cartTotalQuantity,
            });
        }

        // Otherwise, output game data, rating, and num of ratings
        res.render("shop/product-page", {
            title: `${product.title} Details`,
            product,
            genre: product.genre,
            averageRating: product.avgRating,
            totalRatings: product.totalRatings,
            currUserRatingExists,
            cartTotalQuantity,
        });
    } catch (err) {
        console.error(err);

        res.render("shop/product-page", {
            title: req.params.id,
            error: GENERIC_ERR_MSG,
            cartTotalQuantity,
        });
    }
};

const postAddToCart = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        const cartItems = cartItemsInitialize(req.session.cart);
        const updatedCartItems = cartAddItem(cartItems, product, product.id);
        req.session.cart = updatedCartItems;

        res.redirect("/");
    } catch (err) {
        next(err);
    }
};

const postAddRating = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).select("ratings");
        const newRating = {
            user_id: req.user._id,
            user_rating: req.body.rating,
        };
        product.ratings.push(newRating);

        await product.save();

        res.redirect(`/games/${productId}`);
    } catch (err) {
        console.error(err);

        const cartItems = cartItemsInitialize(req.session.cart);
        const cartTotalQuantity = cartCalculateQuantity(cartItems);

        res.render("shop/product-page", {
            title: req.params.id,
            error: GENERIC_ERR_MSG,
            cartTotalQuantity,
        });
    }
};

const getAddGame = (req, res) => {
    res.render("admin/add-game", { title: "New Game" });
};

const postAddGame = async (req, res) => {
    const cartItems = cartItemsInitialize(req.session.cart);
    const cartTotalQuantity = cartCalculateQuantity(cartItems);

    try {
        await gameValidation(req.body);
    } catch (err) {
        return res.render("admin/add-game", {
            title: "New Game",
            error: err.details[0].message,
            cartTotalQuantity,
        });
    }

    try {
        const { title, genre, price, description, img_path } = req.body;

        const product = new Product({
            title,
            genre,
            price,
            description,
            img_path,
        });

        await product.save();

        res.redirect("/");
    } catch (err) {
        console.error(err);

        res.render("admin/add-game", {
            title: "New Game",
            error: GENERIC_ERR_MSG,
            cartTotalQuantity,
        });
    }
};

const getUpdateGame = async (req, res) => {
    const cartItems = cartItemsInitialize(req.session.cart);
    const cartTotalQuantity = cartCalculateQuantity(cartItems);

    try {
        const { id } = req.params;
        var product = await Product.findById(id).lean();

        res.render("admin/update-game", {
            title: "Update Game",
            product: product,
            cartTotalQuantity,
        });
    } catch (err) {
        console.error(err);

        res.render("admin/update-game", {
            title: "Update Game",
            product: product,
            error: GENERIC_ERR_MSG,
            cartTotalQuantity,
        });
    }
};

const patchUpdateGame = async (req, res) => {
    const cartItems = cartItemsInitialize(req.session.cart);
    const cartTotalQuantity = cartCalculateQuantity(cartItems);

    try {
        await gameValidation(req.body);
    } catch (err) {
        return res.render("admin/update-game", {
            title: "Update Game",
            error: err.details[0].message,
            cartTotalQuantity,
        });
    }

    try {
        const { id } = req.params;
        const { title, genre, price, description, img_path } = req.body;
        var updatedProductInfo = {
            title,
            genre,
            price,
            description,
            img_path,
        };

        await Product.findByIdAndUpdate(id, updatedProductInfo, {
            new: true,
        }).setOptions({ sanitizeFilter: true });

        res.redirect(`/games/${id}`);
    } catch (err) {
        console.error(err);

        res.render("admin/update-game", {
            title: "Update Game",
            product: updatedProductInfo,
            error: GENERIC_ERR_MSG,
            cartTotalQuantity,
        });
    }
};

const deleteGame = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);

        res.redirect("/");
    } catch (err) {
        console.error(err);

        const cartItems = cartItemsInitialize(req.session.cart);
        const cartTotalQuantity = cartCalculateQuantity(cartItems);

        res.render("shop/product-page", {
            title: req.params.id,
            error: GENERIC_ERR_MSG,
            cartTotalQuantity,
        });
    }
};

module.exports = {
    getGamesIndex,
    getGamesByGenre,
    getGame,
    postAddToCart,
    postAddRating,
    getAddGame,
    postAddGame,
    getUpdateGame,
    patchUpdateGame,
    deleteGame,
};
