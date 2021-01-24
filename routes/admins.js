const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")

const Admins = require("../models/admin-model")
// const { route } = require("./products")


//Create new admin
router.post("/adminschaerrer/register", async(req, res)=> {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const admin = new Admins({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        const newAdmin = await admin.save()
        res.status(200).json(newAdmin)
    } catch (error) {
        res.status(400).json({messege: error})
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

//Login
router.post("/adminlogin", async (req, res) => {
        const admin = await Admins.findOne({username: req.body.username, email: req.body.email})
        if(!admin){
           return res.status(400).json({messege: "username or email not found"})
        }

        const validPassword = await bcrypt.compare(req.body.password, admin.password)
        if(!validPassword){
            return res.status(400).send.json({messege: "invalid password"})
        } 
    
        return res.status(200).json({messege: "Logged In"})
    
})


module.exports = router