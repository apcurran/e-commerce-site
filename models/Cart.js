"use strict";

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

    generateArray() {
        let arr = [];

        for (let id in this.items) {
            arr.push(this.items[id]);
        }

        return arr;
    }
}