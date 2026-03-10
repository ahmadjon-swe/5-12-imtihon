const ErrorHandler = require("../errors/error")
const SaveSchema = require("../schema/save.schema")
const logger = require("../utils/logger")

const saveCar = async (req, res, next) => {
  try {
    if(!req.user){
      throw ErrorHandler.Forbidden("you are not verified")
    }

    const {_id, email} = req.user
    const {id} = req.params
    if(!id){
      throw ErrorHandler.BadRequest("car id is required")
    }

    const foundedSave = await SaveSchema.findOne({carInfo: id, userInfo: _id})

    if(foundedSave){
      foundedSave.isSaved = !foundedSave.isSaved
      await foundedSave.save()
      res.status(201).json({message: "save updated"})
    }else {
      await SaveSchema.create({carInfo: id, UserInfo: _id, isSaved: true})
      res.status(201).json({message: "saved successfully"})
    }

  } catch (error) {
    next(error)
  }
}

const clearUnsavedCars = async (req, res, next) => {
  try {
    if(!req.user){
      throw ErrorHandler.Forbidden("you are not verified")
    }

    const {role, email} = req.user

    if(role !== "admin" && role !== "superadmin"){
      throw ErrorHandler.Forbidden("you are not admin")
    }

    await SaveSchema.deleteMany({isSaved: false})

    logger.warn(`unsaved cars cleared by: ${email}`)
    res.status(200).json({message: "cleared unsaved cars!"})
  } catch (error) {
    next(error)
  }
}

module.exports = {
  saveCar,
  clearUnsavedCars
}