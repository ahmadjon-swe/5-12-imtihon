const express = require("express")
require("dotenv").config()
const cors = require("cors")
const connectDataBase = require("./config/database.connect")
const cookieParser = require("cookie-parser")
const errorMiddleware = require("./middleware/error.middleware")
const authRouter = require("./router/auth.routes")
const superadminRouter = require("./router/superadmin.routes")
const carRouter = require("./router/car.routes")
const categoryRouter = require("./router/category.routes")


connectDataBase()
const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// ROUTERS
app.use(authRouter)
app.use(superadminRouter)
app.use(carRouter)
app.use(categoryRouter)

// CHECK ERRORS
app.use(errorMiddleware)

PORT = process.env.PORT || 3000
app.listen(PORT, ()=>console.log("Running at: " + PORT))