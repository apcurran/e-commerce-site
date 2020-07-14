"use strict";

// module.exports = function Cart(oldCart) {
//     // Factory function
//     let items = oldCart.items || {};
//     let totalQuantity = oldCart.totalQuantity || 0;
//     let totalPrice = oldCart.totalPrice || 0;

//     function add(item, id) {
//         let storedItem = items[id];

//         if (!storedItem) {
//             storedItem = items[id] = {item: item, quantity: 0, price: 0};
//         }

//         storedItem.quantity++;
//         storedItem.price = storedItem.item.price * storedItem.quantity;

//         totalQuantity++;
//         totalPrice += storedItem.item.price;
//     }

//     function generateArray() {
//         let arr = [];

//         for (let id in items) {
//             const item = items[id];

//             arr.push(item);
//         }

//         return arr;
//     }

//     function getTotalQuantity() {
//         return totalQuantity;
//     }

//     function getTotalPrice() {
//         return totalPrice;
//     }

//     return {
//         add,
//         generateArray,
//         getTotalQuantity,
//         getTotalPrice
//     };
// }

module.exports = class Cart {
    constructor(oldCart) {
        this.items = oldCart.items || {};
        this.totalQty = oldCart.totalQty || 0;
        this.totalPrice = oldCart.totalPrice || 0;
    }

    add(item, id) {
        let storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;

        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    }

    generateArray() {
        let arr = [];

        for (let id in this.items) {
            arr.push(this.items[id]);
        }

        return arr;
    }
}