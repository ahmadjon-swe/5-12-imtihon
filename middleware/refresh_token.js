const jwt = require("jsonwebtoken")
const ErrorHandler = require("../errors/error")
const { access_token } = require("../utils/jwt")

module.exports = function(req, res, next){
  try{
    const token = req.cookies.refresh_token

    if(!token){
      throw ErrorHandler.Forbidden("refresh token not found")
    }

    if(!token){
      throw ErrorHandler.Forbidden("refresh token not found")
    }

    const decode = jwt.decode(token, process.env.REFRESH_SECRET_KEY)

    if(!decode){
      throw ErrorHandler.Forbidden("refresh token can't be read")
    }

    const payload = {
      _id: decode._id,
      email: decode.email,
      role: decode.role,
      phoneNumber: decode.phoneNumber
    }

    const accessToken = access_token(payload)

    res.status(201).json({accessToken})
  }catch(error){
    next(error)
  }

}