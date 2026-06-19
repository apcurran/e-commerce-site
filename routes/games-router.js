import express from "express";

import * as gamesController from "../controllers/games-controller.js";
import {
    checkAdminAuthenticated,
    checkAuthenticated,
} from "../config/check-auth.js";

const router = express.Router();

router.get("/", gamesController.getGamesIndex);
router.get("/games/:id", gamesController.getGame);
router.get("/category/:genre", gamesController.getGamesByGenre);
router.post("/add-to-cart/:id", gamesController.postAddToCart);
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

export default router;
