const express = require("express")
const router = express.Router()

const stripe = require("stripe")(process.env.STRIPE_KEY)
// const uuid = require("uuid/v4")
const { v4: uuidv4 } = require('uuid')

const Products = require("../models/product-model")
const verify = require("../verify-token")

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
router.post("/", verify, async (req, res) => {
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

//Admin Patch product
router.patch("/product/:id", verify, getProduct, async (req, res) => {
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

router.patch("/purchase/update-inventory", async(req, res) => {
    try {
        // Object with counts per id
        const counts = {} 

        req.body.forEach(item => {  
            // Create key value pair for each id
            counts[item._id] = counts[item._id] ? counts[item._id] + 1 : 1
            // add to count per id
        })

        Object.keys(counts).forEach(id => {
            Products.findById(id, (err, doc) => {
                doc.inventory = doc.inventory - counts[id]
                doc.save()
            })
        })


        res.json({message: "OK"})
    }
    catch(error) {
        res.status(400).json({message: error.message})
    }
})

// Delete product 
router.delete("/product/:id", verify, getProduct, async (req, res) => {
    try {
        await res.product.remove()
        res.json({message: `${res.product.name} has been deleted from database`})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Stripe
router.post("/payment", async (req, res) => {
    try{
        const {purchaseAmount, token} = req.body
        console.log("Purchase Amount: ", purchaseAmount)
        const idempontencyKey = uuidv4()

        return stripe.customers.create({
            email: token.email,
            source: token.id
        }).then(custumer => {
            stripe.charges.create({
                amount: purchaseAmount * 100,
                currency: "usd",
                custumer: custumer.id,
                receipt_email: token.email,
                shipping: {
                    name: token.card.name,
                    address: {
                        country: token.card.address_country
                    }
                }
            }, {idempontencyKey})
        }).then(result => res.status(200).json(result))
        
    } catch (error){
        res.status(400).json({message: error.message})
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