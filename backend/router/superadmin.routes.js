const {Router} = require("express")
const authorization = require("../middleware/authorization")
const { changeRole, getAllUsers } = require("../controller/superadmin.controller")

const superadminRouter = Router()

superadminRouter.get("/get_all_users", authorization, getAllUsers)
superadminRouter.patch("/change_role_admin/:id", authorization, changeRole)

module.exports = superadminRouter