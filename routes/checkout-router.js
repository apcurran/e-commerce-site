"use strict";

const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout-controller");
const { checkAuthenticated } = require("../config/check-auth");

router.get("/checkout-preview", checkoutController.getCheckoutPreview);

// Checkout-preview add one instance of an item to cart
router.post("/increase/:id", checkoutController.postIncrease);

// Checkout-preview remove one instance of an item from cart
router.post("/reduce/:id", checkoutController.postReduce);

// Checkout-preview remove one item and all of its quantity from cart
router.get("/remove/:id", checkoutController.getRemove);

// AUTH Protected Routes
router.get("/checkout", checkAuthenticated, checkoutController.getCheckout);

router.post("/api/create-payment-intent", checkAuthenticated, checkoutController.postApiCreatePaymentIntent);

router.post("/api/successful-order", checkAuthenticated, checkoutController.postApiSuccessfulOrder);

module.exports = router;