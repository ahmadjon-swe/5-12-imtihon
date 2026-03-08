const {Router} = require("express")
const authorization = require("../middleware/authorization")
const { changeRole } = require("../controller/superadmin.controller")

const superadminRouter = Router()

superadminRouter.patch("/change_role_admin", authorization, changeRole)

module.exports = superadminRouter