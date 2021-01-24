const mongoose = require("mongoose")
const Schema = mongoose.Schema

const carouselImgSchema = new Schema({
    carouselImgUrl: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("carouselImgs", carouselImgSchema)