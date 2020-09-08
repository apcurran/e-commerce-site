"use strict";

const express = require("express");
const router = express.Router();
const gamesController = require("../controllers/games-controller");
const { checkAdminAuthenticated } = require("../config/check-auth");
const { checkAuthenticated } = require("../config/check-auth");

// GET Page Views
router.get("/", gamesController.getGamesIndex);

router.get("/games/action", gamesController.getGamesAction);

router.get("/games/adventure", gamesController.getGamesAdventure);

router.get("/games/rpg", gamesController.getGamesRpg);

router.get("/games/sports", gamesController.getGamesSports);

// GET Single Product
router.get("/games/:id", gamesController.getGame);

// GET Add game to cart
router.get("/add-to-cart/:id", gamesController.getAddToCart);

// POST game rating
router.post("/games/:id/add-rating", checkAuthenticated, gamesController.postAddRating);

//// ADMIN PROTECTED ROUTES ////
router.get("/game/add", checkAdminAuthenticated, gamesController.getAddGame);

router.post("/game/add", checkAdminAuthenticated, gamesController.postAddGame);

router.get("/games/:id/update", checkAdminAuthenticated, gamesController.getUpdateGame);

router.patch("/games/:id/update", checkAdminAuthenticated, gamesController.patchUpdateGame);

// DELETE Single Product
router.delete("/games/:id", checkAdminAuthenticated, gamesController.deleteGame);

module.exports = router;