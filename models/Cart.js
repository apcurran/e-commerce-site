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
 *     itemTotalPrice: number
 * }} cartItem
 */

/**
 * @typedef {{
 *     cartItems: cartItem[],
 *     cartTotalQuantity: number,
 *     cartTotalPrice: number
 * }} cart
 */

/**
 * @param {cart|null} sessionCart pre-existing cart stored in session
 * @returns {cart}
 */
function cartInitialize(sessionCart) {
    if (sessionCart) return sessionCart;

    return {
        cartItems: [],
        cartTotalQuantity: 0,
        cartTotalPrice: 0
    };
}

/**
 * @param {cart} cart
 * @param {product} productDetails
 * @param {string} productId
 * @returns {cart} modified cart
 */
function cartAddItem(cart, productDetails, productId) {
    let previousStoredItemIndex = cart.cartItems.findIndex((item) => item.itemDetails._id === productId);

    if (previousStoredItemIndex === -1) {
        let product = {
            itemDetails: productDetails,
            itemQuantity: 1,
            itemTotalPrice: productDetails.price
        };
        cart.cartItems.push(product);
    } else {
        // update ITEM quantity
        cart.cartItems[previousStoredItemIndex].itemQuantity++;
        // update ITEM price
        const updatedItemTotal = cart.cartItems[previousStoredItemIndex].itemDetails.price * cart.cartItems[previousStoredItemIndex].itemQuantity;
        cart.cartItems[previousStoredItemIndex].itemTotalPrice = updatedItemTotal;
    }

    const storedItem = cart.cartItems.find((item) => String(item.itemDetails._id) === productId);
    // update CART quantity
    cart.cartTotalQuantity++;
    // update CART price
    cart.cartTotalPrice += storedItem.itemTotalPrice;

    return cart;
}

/**
 * 
 * @param {cart} cart 
 * @param {string} productId 
 * @returns {cart} modified cart after item removal
 */
function cartRemoveItem(cart, productId) {
    const storedItemIndex = cart.cartItems.findIndex((item) => String(item.itemDetails._id) === productId);
    const storedItem = cart.cartItems[storedItemIndex];

    // update data
    cart.cartTotalQuantity -= storedItem.itemQuantity;
    cart.cartTotalPrice -= storedItem.itemTotalPrice;
    // remove item from cart
    cart.cartItems.splice(storedItemIndex, 1);

    return cart;
}


// old implementation
class Cart {
    constructor(oldCart) {
        this.items = oldCart.items || {};
        this.totalQty = oldCart.totalQty || 0;
        this.totalPrice = oldCart.totalPrice || 0;
    }

    add(item, id) {
        let storedItem = this.items[id];
        
        if (!storedItem) {
            this.items[id] = { item: item, qty: 0, price: 0 };
            storedItem = this.items[id];
        }

        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;

        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    }

    incrementByOne(id) {
        // Adjust game count and total game price
        this.items[id].qty++;
        this.items[id].price += this.items[id].item.price;
        // Adjust total cart qty and total cart price
        this.totalQty++;
        this.totalPrice += this.items[id].item.price;
    }

    reduceByOne(id) {
        // Adjust game count and total game price
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        // Adjust total cart qty and total cart price
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    }

    removeItem(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;

        delete this.items[id];
    }

    static generateArray(cartObj) {
        let arr = [];

        for (let id in cartObj.items) {
            arr.push(cartObj.items[id]);
        }

        return arr;
    }
}

module.exports = {
    Cart,
    cartInitialize,
    cartAddItem,
    cartRemoveItem,
};