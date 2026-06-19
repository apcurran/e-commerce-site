import express from "express";
import passport from "passport";

import * as userController from "../controllers/user-controller.js";
import {
    checkNotAuthenticated,
    checkAuthenticated,
} from "../config/check-auth.js";

const router = express.Router();

router.get("/signup", checkNotAuthenticated, userController.getSignup);
router.post("/signup", checkNotAuthenticated, userController.postSignup);
router.get("/login", checkNotAuthenticated, userController.getLogin);
router.post(
    "/login",
    checkNotAuthenticated,
    passport.authenticate("local.login", {
        failureRedirect: "/user/login",
        failureFlash: true,
    }),
    userController.postLogin,
);
router.get("/profile", checkAuthenticated, userController.getProfile);
router.get("/logout", userController.getLogout);

export default router;
