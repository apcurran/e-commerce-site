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

// OLD IMPLEMENTATION
// /**
//  * @param {cart|null} sessionCart pre-existing cart stored in session
//  * @returns {cart}
//  */
// function cartInitialize(sessionCart) {
//     if (sessionCart) return sessionCart;

//     return {
//         cartItems: [],
//         cartTotalQuantity: 0,
//         cartTotalPrice: 0
//     };
// }

// /**
//  * @param {cart} cart
//  * @param {product} productDetails
//  * @param {string} productId
//  * @returns {cart} modified cart
//  */
// function cartAddItem(cart, productDetails, productId) {
//     let previousStoredItemIndex = cartItems.findIndex((item) => String(item.itemDetails._id) === productId);

//     if (previousStoredItemIndex === -1) {
//         let product = {
//             itemDetails: productDetails,
//             itemQuantity: 1,
//             itemTotalPrice: productDetails.price
//         };
//         cartItems.push(product);
//     } else {
//         // update ITEM quantity
//         cartItems[previousStoredItemIndex].itemQuantity++;
//         // update ITEM price
//         const updatedItemTotal = cartItems[previousStoredItemIndex].itemDetails.price * cartItems[previousStoredItemIndex].itemQuantity;
//         cartItems[previousStoredItemIndex].itemTotalPrice = updatedItemTotal;
//     }

//     const storedItem = cartItems.find((item) => String(item.itemDetails._id) === productId);
//     // update CART quantity
//     cartTotalQuantity++;
//     // update CART price
//     cartTotalPrice += storedItem.itemTotalPrice;

//     return cart;
// }

// /**
//  * 
//  * @param {cart} cart 
//  * @param {string} productId 
//  * @returns {cart} modified cart after item removal
//  */
// function cartRemoveItem(cart, productId) {
//     const storedItemIndex = cartItems.findIndex((item) => String(item.itemDetails._id) === productId);
//     const storedItem = cartItems[storedItemIndex];

//     if (storedItem === undefined) return cart;

//     // update data
//     cartTotalQuantity -= storedItem.itemQuantity;
//     cartTotalPrice -= storedItem.itemTotalPrice;
//     // remove item from cart
//     cartItems.splice(storedItemIndex, 1);

//     return cart;
// }

// /**
//  * @param {cart} cart
//  * @param {string} productId 
//  * @returns {cart}
//  */
// function cartIncrementByOne(cart, productId) {
//     const storedItemIndex = cartItems.findIndex((item) => String(item.itemDetails._id) === productId);
//     const storedItem = cartItems[storedItemIndex];

//     if (storedItem === undefined) return cart;
    
//     // adjust item quantity and item total price
//     cartItems[storedItemIndex].itemQuantity++;
//     cartItems[storedItemIndex].itemTotalPrice += storedItem.itemDetails.price;
//     // adjust total cart quantity and total cart price
//     cartTotalQuantity++;
//     cartTotalPrice += storedItem.itemDetails.price;

//     return cart;
// }

// /**
//  * 
//  * @param {cart} cart 
//  * @param {string} productId 
//  * @returns {cart}
//  */
// function cartDecrementByOne(cart, productId) {
//     const storedItemIndex = cartItems.findIndex((item) => String(item.itemDetails._id) === productId);
//     const storedItem = cartItems[storedItemIndex];

//     if (storedItem === undefined) return cart;

//     // adjust item quantity and item total price
//     cartItems[storedItemIndex].itemQuantity--;
//     cartItems[storedItemIndex].itemTotalPrice -= storedItem.itemDetails.price;
//     // adjust total cart quantity and total cart price
//     cartTotalQuantity--;
//     cartTotalPrice -= storedItem.itemDetails.price;

//     if (storedItem.itemQuantity <= 0) {
//         // remove item from cart
//         cartItems.splice(storedItemIndex, 1);
//     }

//     return cart;
// }

module.exports = {
    cartItemsInitialize,
    cartAddItem,
    cartRemoveItem,
    cartIncrementByOne,
    cartDecrementByOne,
    cartCalculateTotal,
    cartCalculateQuantity
};