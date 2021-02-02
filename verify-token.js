const jwt = require("jsonwebtoken")

module.exports = function(req, res, next){
    const token = req.header("auth-token") || req.cookies["auth-token"]
    if(!token) {
        return res.status(400).json({messege: "Access Denied"})
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.admin = verified
        next()
    } catch (error) {
        res.status(400).json({messege: error.messege})
    }

}
