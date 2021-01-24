const express = require("express")
const router = express.Router()

const Products = require("../models/product-model")

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Products.find()
        res.json(products)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// Add new product
router.post("/", async (req, res) => {
    const product = new Products({
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        category: req.body.category,
        inventory: req.body.inventory
    })
    try {
        const newProduct = await product.save()
        res.status(200).json(newProduct)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

// Get one product 
router.get("/product/:id", getProduct, (req, res) => {
    res.send(res.product)
})

// Patch product
router.patch("/product/:id", getProduct, async (req, res) => {
    if(req.body.name != null){
        res.product.name = req.body.name
    }
    if(req.body.description != null){
        res.product.description = req.body.description
    }
    if(req.body.imageUrl != null){
        res.product.imageUrl = req.body.imageUrl
    }
    if(req.body.price != null){
        res.product.price = req.body.price
    }
    if(req.body.category != null){
        res.product.category = req.body.category
    }
    if(req.body.inventory != null){
        res.product.inventory = req.body.inventory
    }

    try{
        const updatedProduct = await res.product.save()
        res.json(updatedProduct)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

// Delete product 
router.delete("/product/:id", getProduct, async (req, res) => {
    try {
        await res.product.remove()
        res.json({message: `${res.product.name} has been deleted from database`})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//this middleware function allows me to grab the product by id
async function getProduct (req, res, next) {
    try {
        product = await Products.findById(req.params.id)
        if(product == null) {
            return res.status(404).json({message: "product doesnt exist"})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

    res.product = product
    next()
}

module.exports = router