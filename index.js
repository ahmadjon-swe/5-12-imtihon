const express = require("express")
require("dotenv").config()
const cors = require("cors")
const connectDataBase = require("./config/database.connect")
const cookieParser = require("cookie-parser")
const errorMiddleware = require("./middleware/error.middleware")
const authRouter = require("./router/auth.routes")
const adminRouter = require("./router/admin.routes")


connectDataBase()
const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// ROUTERS
app.use(authRouter)
app.use(adminRouter)

// CHECK ERRORS
app.use(errorMiddleware)

PORT = process.env.PORT || 3000
app.listen(PORT, ()=>console.log("Running at: " + PORT))