const express = require("express")
const router = express.Router()

const Admins = require("../models/admin-model")
const { route } = require("./products")

//Create new admin
router.post("/adminschaerrer/register", async(req, res)=> {
    const admin = new Admins({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    try {
        const newAdmin = await admin.save()
        res.status(200).json(newAdmin)
    } catch (error) {
        res.status(400).json({messege: error.messege})
    }
})

//Delete admin
router.delete("/adminschaerrer/delete/:id", async(req, res) => {
    Admins.findByIdAndDelete(req.params.id, (error, admin)=> {
        if(error){
            res.status(404).json({messege: error.messege})
        } else {
            res.status(200).json({messege: `${admin.username} has been deleted as an admin`})
        }
    })
})


module.exports = router