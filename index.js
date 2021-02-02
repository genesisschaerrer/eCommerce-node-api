require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors") 


const port = process.env.PORT || 4000
const app = express()

mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on("error", (error) => console.log(error))
db.once("open", () => console.log("Conneceted to Database"))


app.use(cors({
    exposedHeaders: "auth-token"
}))
app.use(express.json())

const adminRoutes = require("./routes/admins")
const productRoutes = require("./routes/products")
const carouselImgsRoutes  = require("./routes/about-page-carousel")

app.use("/", adminRoutes)
app.use("/", productRoutes)
app.use("/", carouselImgsRoutes)


app.listen(port, () => console.log(`server listening on port ${port}`))

