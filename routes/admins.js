const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const Admins = require("../models/admin-model")
const verify = require("../verify-token")

//Create new admin
router.post("/register", verify, async(req, res)=> {
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
            return res.status(400).json({messege: "invalid password"})
        } 
    
        const token = jwt.sign({_id: admin._id}, process.env.TOKEN_SECRET)
        
        res.cookie("auth-token", token, {httpOnly: true, secure: true, sameSite: "none"})
        res.header("auth-token", token).status(200).send(token)
        //res.cookie("login-cookie", token)
    
})

router.get("/check-login", verify, (req, res) => {
    res.json({messege: "logged in"})
})

router.delete("/logout", (req, res) => {
    res.clearCookie("auth-token").status(200).json({messege: "Logged Out"})
})

module.exports = router