const ErrorHandler = require("../errors/error");
const logger = require("../utils/logger");

module.exports = async(err, req, res, next) => {
  if(err instanceof ErrorHandler){
    logger.warn("Handled error: " + err.message, {errors: err.errors})
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors
    })
  }

  logger.error("Unhandled error: %s", err.message, { stack: err.stack, url: req.originalUrl })
  return res.status(500).json({message: err.message})
  
}