import mongoose from "mongoose";

const RatingsSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    user_rating: { type: Number, required: true },
});

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: {
        type: String,
        required: true,
        enum: {
            values: [
                "action",
                "adventure",
                "rpg",
                "sports",
                "horror",
                "fantasy",
            ],
            message: "{VALUE} is not a valid genre",
        },
    },
    price: { type: Number, min: 1, required: true },
    description: { type: String, required: true },
    img_path: { type: String, required: true },
    ratings: [RatingsSchema],
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
