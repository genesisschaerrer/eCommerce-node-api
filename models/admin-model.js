const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        maxlength: 15,
        minlength: 6,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true,
        minlength: 8
    }

})

module.exports = mongoose.model("admins", adminSchema)