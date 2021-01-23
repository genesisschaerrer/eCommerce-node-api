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


app.use(cors())
app.use(express.json())

const productRoutes = require("./routes/products")
const adminRoutes = require("./routes/admins")

app.use("/", productRoutes)
app.use("/admin", adminRoutes)

app.listen(port, () => console.log(`server listening on port ${port}`))