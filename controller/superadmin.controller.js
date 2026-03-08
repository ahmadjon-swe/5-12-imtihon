const ErrorHandler = require("../errors/error")
const AuthSchema = require("../schema/auth.schema")
const logger = require("../utils/logger")


const changeRole = async (req, res, next) => {
  try {
    if(!req.user){
      throw ErrorHandler.Forbidden("you are not verified")
    }
    const {role, email} = req.user

    if(role !== "superadmin"){
      throw ErrorHandler.Forbidden("you are not superadmin")
    }

    const {id} = req.params

    if(!id){
      throw ErrorHandler.BadRequest("id is required")
    }
    
    const foundedUser = await AuthSchema.findById(id)

    if(!foundedUser){
      throw ErrorHandler.NotFound("user not found")
    }
    if(foundedUser.role==="superadmin"){
      throw ErrorHandler.Forbidden("superadmin's role can't be changed")
    }else if(foundedUser.role==="user"){
      foundedUser.role = "admin"
      await foundedUser.save()
    }else if(foundedUser.role === "admin"){
      foundedUser.role = "user"
      await foundedUser.save()
    }

    logger.warn(`${foundedUser.email}'s role updated to: ${foundedUser.role}, by: ${email}`)
    res.status(200).json({message: "role changed"})
  } catch (error) {
    next(error)
  }
}

module.exports = {changeRole}