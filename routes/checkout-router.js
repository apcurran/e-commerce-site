import express from "express";

import * as checkoutController from "../controllers/checkout-controller.js";
import { checkAuthenticated } from "../config/check-auth.js";

const router = express.Router();

router.get("/checkout-preview", checkoutController.getCheckoutPreview);
// Checkout-preview add one instance of an item to cart
router.post("/increase/:id", checkoutController.postIncrease);
// Checkout-preview remove one instance of an item from cart
router.post("/reduce/:id", checkoutController.postReduce);
// Checkout-preview remove one item and all of its quantity from cart
router.post("/remove/:id", checkoutController.postRemove);

// AUTH Protected Routes
router.get("/checkout", checkAuthenticated, checkoutController.getCheckout);
router.post(
    "/api/create-payment-intent",
    checkAuthenticated,
    checkoutController.postApiCreatePaymentIntent,
);
router.post(
    "/api/successful-order",
    checkAuthenticated,
    checkoutController.postApiSuccessfulOrder,
);

export default router;
