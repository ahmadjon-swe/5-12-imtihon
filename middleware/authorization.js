const ErrorHandler = require("../errors/error")
const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization

    if(!authorization){
      throw ErrorHandler.UnAuthorized("(no token) you are not logged in")
    }

    const [Bearer, token] = authorization.split(" ")

    
    if(Bearer !== "Bearer" || !token){
      throw ErrorHandler.BadRequest("Bearer token is required")
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY)

    if(!decode){
      throw ErrorHandler.BadRequest("token verifying failed")
    }
    req.user = decode

    next()
  } catch (error) {
    next(error)
  }
}