const express = require("express")
const router = express.Router()

const verify = require("../verify-token")
const carouselImgs = require("../models/carousel-model")

// Get all images
router.get("/about", async (req, res) => {
    try {
        const allCarouselImgs = await carouselImgs.find()
        res.json(allCarouselImgs)
    } catch (error) {
        res.status(500).json({messege: error.messege})
    }
})

// Post new image
router.post("/about", verify, (req, res) => {
    const newCarouselImg = new carouselImgs(req.body)

    newCarouselImg.save()
    .then(newCarouselImg => {
        const {carouselImgUrl} = newCarouselImg

        res.status(200).json({carouselImgUrl})
    }) .catch(error => {
        res.status(400).json({messege: error.messege})
    })
})

//Delete image
router.delete("/about/:id", verify, (req, res) => {
    carouselImgs.findByIdAndDelete(req.params.id, (error, carouselImg) => {
        if(error){
            res.status(404).json({messege: error.messege})
        } else {
            res.status(200).json({messege: `Image with the url:${carouselImg.carouselImgUrl} has been deleted`})
        }
    })
})


module.exports = router