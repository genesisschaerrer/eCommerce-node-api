const mongoose = require("mongoose")
const Schema = mongoose.Schema

const productSchema = new Schema ({
    name: {
        type: String,
        maxlength: 35,
        unique: true,
        required: true
    },
    description: {
        type: String,
        maxlength: 400,
        required: true
    },
    imageUrl: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    }, 
    inventory: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("products", productSchema)