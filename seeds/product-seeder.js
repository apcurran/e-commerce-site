
// Specified database as argument - e.g.: node product-seeder.js mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/my_cool_project?retryWrites=true'

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

const Product = require("../models/Product");
const mongoose = require("mongoose");

var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const products = [
    new Product({
        title: "Titanfall 2",
        genre: "action",
        price: 10.00,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Integer eget aliquet nibh praesent tristique magna sit. Egestas pretium aenean pharetra magna ac. Donec ultrices tincidunt arcu non sodales neque sodales. Ornare lectus sit amet est placerat in egestas erat. Neque convallis a cras semper auctor neque vitae tempus quam.",
        img_path: "/images/game-covers/titanfall2.jpg"
    }),
    new Product({
        title: "Chrono Trigger",
        genre: "rpg",
        price: 8.00,
        description: "Velit ut tortor pretium viverra suspendisse potenti nullam ac. Vitae sapien pellentesque habitant morbi tristique senectus et netus et. Proin sagittis nisl rhoncus mattis rhoncus. Suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam. Ornare aenean euismod elementum nisi quis eleifend quam adipiscing vitae.",
        img_path: "/images/game-covers/chrono-trigger.jpg" 
    }),
    new Product({
        title: "Destiny 2",
        genre: "action",
        price: 20.00,
        description: "Id aliquet lectus proin nibh nisl condimentum id venenatis a. Egestas erat imperdiet sed euismod. Aliquet risus feugiat in ante metus dictum. Diam volutpat commodo sed egestas egestas. Vel facilisis volutpat est velit egestas dui id. Amet aliquam id diam maecenas ultricies mi eget mauris. ",
        img_path: "/images/game-covers/destiny2.jpg" 
    }),
    new Product({
        title: "Doom",
        genre: "action",
        price: 5.00,
        description: "Sem fringilla ut morbi tincidunt augue interdum velit euismod. Dui vivamus arcu felis bibendum. Eu lobortis elementum nibh tellus molestie nunc non blandit massa. Porta lorem mollis aliquam ut porttitor leo a diam sollicitudin. Dui sapien eget mi proin sed libero enim sed faucibus.",
        img_path: "/images/game-covers/doom.jpg" 
    }),
    new Product({
        title: "Dota 2 Battle Pass",
        genre: "rpg",
        price: 10.00,
        description: "Eget nullam non nisi est sit amet facilisis. Mauris ultrices eros in cursus turpis. Est sit amet facilisis magna. Fames ac turpis egestas sed. Feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Nisi lacus sed viverra tellus in hac. Parturient montes nascetur ridiculus mus mauris vitae ultricies leo. Dui faucibus in ornare quam viverra orci.",
        img_path: "/images/game-covers/dota2.jpg" 
    }),
    new Product({
        title: "F1 2020",
        genre: "sports",
        price: 50.00,
        description: "Sollicitudin nibh sit amet commodo. Elit ut aliquam purus sit amet luctus venenatis lectus magna. Egestas purus viverra accumsan in nisl nisi scelerisque eu ultrices. Facilisis leo vel fringilla est ullamcorper. Amet massa vitae tortor condimentum. Et pharetra pharetra massa massa ultricies mi quis hendrerit.",
        img_path: "/images/game-covers/f1-2020.jpg" 
    }),
    new Product({
        title: "Halo Collection",
        genre: "action",
        price: 30,
        description: "Phasellus faucibus scelerisque eleifend donec pretium. Lorem ipsum dolor sit amet consectetur adipiscing. Dolor sed viverra ipsum nunc aliquet. Congue nisi vitae suscipit tellus mauris a diam. Tincidunt eget nullam non nisi est sit. Tristique senectus et netus et malesuada fames ac turpis egestas. Turpis nunc eget lorem dolor sed.",
        img_path: "/images/game-covers/halo-collection.jpg" 
    })
];

async function populateDB() {
    for (let product of products) {
        await product.save();
    }
    
    mongoose.disconnect();
}

populateDB();
