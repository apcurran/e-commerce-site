import express from "express";
import passport from "passport";

import * as adminController from "../controllers/admin-controller.js";
import { checkNotAuthenticated } from "../config/check-auth.js";

const router = express.Router();

router.get("/login", checkNotAuthenticated, adminController.getLogin);
router.post(
    "/login",
    checkNotAuthenticated,
    passport.authenticate("local.adminLogin", {
        failureRedirect: "/admin/login",
        failureFlash: true,
    }),
    adminController.postLogin,
);
router.get("/signup", checkNotAuthenticated, adminController.getSignup);
router.post("/signup", checkNotAuthenticated, adminController.postSignup);

export default router;
