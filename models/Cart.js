"use strict";

/**
 * @typedef {{
 *     id: string,
 *     title: string,
 *     genre: string,
 *     price: number,
 *     description: string,
 *     img_path: string,
 *     ratings: [{
 *         user_id: string;
 *         user_rating: number;
 *     }]  
 * }} product
 */

/**
 * @typedef {{
 *     itemDetails: product,
 *     itemQuantity: number,
 * }} cartItem
 */

// NEW IMPLEMENTATION
/**
 * @param {cartItem[]|null} sessionCartItems pre-existing cart stored in session
 * @returns {cartItem[]}
 */
function cartItemsInitialize(sessionCartItems) {
    if (sessionCartItems) return sessionCartItems;

    return [];
}

/**
 * @param {cartItem[]} cartItems
 * @param {product} productDetails
 * @param {string} productId
 * @returns {cartItem[]} modified cart
 */
function cartAddItem(cartItems, productDetails, productId) {
    let previousStoredItemIndex = cartItems.findIndex((item) => String(item.itemDetails._id) === productId);

    if (previousStoredItemIndex === -1) {
        // create a new item for cartItems
        let product = {
            itemDetails: productDetails,
            itemQuantity: 1,
        };
        cartItems.push(product);
    } else {
        cartItems[previousStoredItemIndex].itemQuantity++;
    }

    return cartItems;
}

/**
 * 
 * @param {cartItem[]} cartItems 
 * @param {string} productId 
 * @returns {cartItem[]} modified cart after item removal
 */
function cartRemoveItem(cartItems, productId) {
    const storedItemIndex = cartItems.findIndex((item) => String(item.itemDetails._id) === productId);
    const storedItem = cartItems[storedItemIndex];

    if (storedItem === undefined) return cartItems;

    // remove item from cart
    cartItems.splice(storedItemIndex, 1);

    return cartItems;
}

/**
 * @param {cartItem[]} cartItems
 * @param {string} productId 
 * @returns {cartItem[]}
 */
function cartIncrementByOne(cartItems, productId) {
    const storedItem = cartItems.find((item) => String(item.itemDetails._id) === productId);

    if (storedItem === undefined) return cartItems;
    
    storedItem.itemQuantity++;

    return cartItems;
}

/**
 * @param {cartItem[]} cartItems 
 * @param {string} productId 
 * @returns {cartItem[]}
 */
function cartDecrementByOne(cartItems, productId) {
    const storedItemIndex = cartItems.findIndex((item) => String(item.itemDetails._id) === productId);
    const storedItem = cartItems[storedItemIndex];

    if (storedItem === undefined) return cartItems;

    // adjust item quantity and item total price
    storedItem.itemQuantity--;

    if (storedItem.itemQuantity <= 0) {
        // remove item from cart
        cartItems.splice(storedItemIndex, 1);
    }

    return cartItems;
}

/**
 * @param {cartItem[]} cartItems 
 * @returns {number} cart grand total
 */
function cartCalculateTotal(cartItems) {
    let grandTotal = 0;

    for (let cartItem of cartItems) {
        const itemTotal = cartItem.itemQuantity * cartItem.itemDetails.price;
        grandTotal += itemTotal;
    }

    return grandTotal;
}

/**
 * @param {cartItem[]} cartItems 
 * @returns {number} cart quantity
 */
function cartCalculateQuantity(cartItems) {
    let cartQuantity = 0;

    for (let cartItem of cartItems) {
        cartQuantity += cartItem.itemQuantity;
    }

    return cartQuantity;
}

module.exports = {
    cartItemsInitialize,
    cartAddItem,
    cartRemoveItem,
    cartIncrementByOne,
    cartDecrementByOne,
    cartCalculateTotal,
    cartCalculateQuantity
};