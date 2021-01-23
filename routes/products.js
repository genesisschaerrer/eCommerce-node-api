const express = require("express")
const router = express.Router()

// Get all products
router.get("/", (req, res) => {
    res.send("got all products")
})

// Get one product 
router.get("/:id", (req, res) => {
    res.send("got one product by id")
})

// Add new product
router.post("/", (req, res) => {
    res.send('hit the post route')
})

// Patch product
router.patch("/:id", (req, res) => {
    res.send("hit the patch route")
})

// Delete product 
router.delete("/:id", (req, res) => {
    res.send("hit delete route")
})

module.exports = router