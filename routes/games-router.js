"use strict";

const express = require("express");
const router = express.Router();
const gamesController = require("../controllers/games-controller");
const { checkAdminAuthenticated } = require("../config/check-auth");
const { checkAuthenticated } = require("../config/check-auth");

// GET Page Views
router.get("/", gamesController.getGamesIndex);

// GET Single Product
router.get("/games/:id", gamesController.getGame);

// GET Games page by genre
router.get("/category/:genre", gamesController.getGamesByGenre);

// POST Add game to cart
router.post("/add-to-cart/:id", gamesController.postAddToCart);

// POST game rating
router.post(
    "/games/:id/add-rating",
    checkAuthenticated,
    gamesController.postAddRating,
);

//// ADMIN PROTECTED ROUTES ////
router.get("/game/add", checkAdminAuthenticated, gamesController.getAddGame);

router.post("/game/add", checkAdminAuthenticated, gamesController.postAddGame);

router.get(
    "/games/:id/update",
    checkAdminAuthenticated,
    gamesController.getUpdateGame,
);

router.patch(
    "/games/:id/update",
    checkAdminAuthenticated,
    gamesController.patchUpdateGame,
);

// DELETE Single Product
router.delete(
    "/games/:id",
    checkAdminAuthenticated,
    gamesController.deleteGame,
);

module.exports = router;
