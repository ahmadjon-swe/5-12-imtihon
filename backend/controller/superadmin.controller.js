const ErrorHandler = require("../errors/error")
const AuthSchema = require("../schema/auth.schema")
const logger = require("../utils/logger")

// GET ALL ///////////////////////////////////////////////////////////////////////////////////////
const getAllUsers = async (req, res, next) => {
  try {
    if (!req.user) {
      throw ErrorHandler.Forbidden("you are not verified");
    }
    
    const {role} = req.user;
    
    if (role !== "superadmin") {
      throw ErrorHandler.Forbidden("you are not superadmin");
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ""
    const sort = req.query.sort || "createdAt"

    const skip = (page - 1) * limit

    const query = {}

    if(search.trim()){
      query.username = {$regex: search, $options: "i"}
    }

    const total = await AuthSchema.countDocuments(query)
    const users = await AuthSchema.find(query)
      .select("-password -otp -otpTime -refreshToken")
      .sort(sort).skip(skip).limit(limit)

    if(!users){
      throw ErrorHandler.NotFound("users not found")
    }

    res.status(200).json({
      totalPage: Math.ceil(total / limit),
      prev: page > 1 ? {page: page - 1, limit} : undefined,
      next: total > page * limit ? {page: page + 1, limit} : undefined,
      data: users
    })
  } catch (error) {
    next(error)
  }
}

// CHANGE ROLE ///////////////////////////////////////////////////////////////////////////////
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

module.exports = {changeRole, getAllUsers}