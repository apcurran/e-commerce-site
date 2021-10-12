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

    generateArray() {
        let arr = [];

        for (let id in this.items) {
            arr.push(this.items[id]);
        }

        return arr;
    }
};