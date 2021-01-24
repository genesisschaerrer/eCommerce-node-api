const express = require("express")
const router = express.Router()

const Admins = require("../models/admin-model")

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


module.exports = router