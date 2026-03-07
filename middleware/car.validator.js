const ErrorHandler = require("../errors/error")
const carValidator = require("../validator/car.validate")


module.exports = (req, res, next) => {
    const {error} = carValidator.validate(req.body)

    if(error){
      throw ErrorHandler.BadRequest(error.message)
    }

    next()
}