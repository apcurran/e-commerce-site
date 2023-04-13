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
 * @param {?cart} sessionCart pre-existing cart stored in session
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
 * @param {string} cartItemId
 * @returns {cart} modified cart
 */
function cartAddItem(cart, productDetails, cartItemId) {
    let previousStoredItem = cart.cartItems.find((item) => item.itemDetails.id === cartItemId);

    if (!previousStoredItem) {
        let product = {
            itemDetails: productDetails,
            itemQuantity: 1,
            itemPrice: productDetails.price
        };
        cart.cartItems.push(product);

        return cart;
    }

    // update quantity
    previousStoredItem.itemQuantity++;
    // update item price
    const updatedItemTotal = previousStoredItem.itemDetails.price * previousStoredItem.itemQuantity;
    previousStoredItem.itemTotalPrice = updatedItemTotal;
}


// old implementation
module.exports = class Cart {
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
};