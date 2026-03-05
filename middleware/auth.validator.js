const ErrorHandler = require("../errors/error")
const authValidator = require("../validator/auth.validate")


module.exports = (req, res, next) => {
  const {error} = authValidator(req.body)

  if(error){
    throw ErrorHandler.BadRequest(error.message)
  }

  next()
}