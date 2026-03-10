const {Router} = require("express")
const { register, login, logout, verify, delete_account, resend_otp, change_password, forgot_password, forgot_password_verify} = require("../controller/auth.controller")
const authorization = require("../middleware/authorization")
const authValidator = require("../middleware/auth.validator")
const refresh_token = require("../middleware/refresh_token")


const authRouter = Router()

authRouter.post("/register", authValidator, register)
authRouter.post("/login", login)
authRouter.post("/logout", authorization, logout)
authRouter.post("/verify", verify)
authRouter.delete("/delete_account",authorization, delete_account)
authRouter.post("/resend_otp", resend_otp)
authRouter.patch("/change_password", authorization, change_password)
authRouter.post("/forgot_password", forgot_password)
authRouter.post("/forgot_password_verify", forgot_password_verify)

// refresh token
authRouter.post("/refresh_token", refresh_token)

module.exports = authRouter