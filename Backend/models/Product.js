const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    images: {
       type: Array,
       required: false
    }
})

module.exports = mongoose.model("Products", ProductSchema)