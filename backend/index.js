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

// DOCUMENTATION
const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerDoc = YAML.load("./docs/documentation.yml")

connectDataBase()
const app = express()
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true 
}))
app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static("uploads"))

// ROUTERS
app.use(authRouter)
app.use(superadminRouter)
app.use(carRouter)
app.use(categoryRouter)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc))

// CHECK ERRORS
app.use(errorMiddleware)

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>console.log("Running at: " + PORT))