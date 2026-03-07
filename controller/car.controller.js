const ErrorHandler = require("../errors/error")
const CarSchema = require("../schema/car.schema")
const logger = require("../utils/logger")

// get_all ////////////////////////////////////////////////////////////////////////////////////
const getAllCars = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ""
    const sort = req.query.sort || "createdAt"
    
    const skip = (page-1) * limit
    
    const query = {}

    if(search.trim()){
      query.name = {$regex: search, $options: "i"}
    }
    
    const total = await CarSchema.countDocuments(query)
    const cars = await CarSchema.find(query).populate("category", "name -_id").sort(sort).skip(skip).limit(limit)

    if(!cars){
      throw ErrorHandler.NotFound("404 cars are not found")
    }

    res.status(200).json({
      totalPage: Math.ceil(total/limit),
      prev: page>1 ? {page: page-1, limit} : undefined,
      next: total > page * limit ? {page: page+1, limit} : undefined,
      data: cars
    })
  } catch (error) {
    next(error)
  }
}


// get_one ////////////////////////////////////////////////////////////////////////////////////
const getOneCar = async (req, res, next) => {
  try {
    const reqID = req.params.id
    const car = await CarSchema.findById(reqID).populate("category", "name -_id")

    if(!car){
      throw ErrorHandler.NotFound("404 car is not found")
    }

    res.status(200).json(car)
  } catch (error) {
    next(error)
  }
}


// add ////////////////////////////////////////////////////////////////////////////////////
const addCar = async (req, res, next) => {
  try {
    if(!req.user){
      throw ErrorHandler.Forbidden("you are not verified")
    }

    const {_id, role, email} = req.user

    if(role !== "admin" && role !== "superadmin"){
      throw ErrorHandler.Forbidden("you are not admin")
    }

    const {name, category, tan, motor, year, color, distance, gearbox, price, description} = req.body

    if(!name || !category || tan === undefined || !motor || !year || !color || distance === undefined || !gearbox || !price || !description){
      throw ErrorHandler.BadRequest("all fields are required")
    }

    if(!req.file){
      throw ErrorHandler.BadRequest("image is required")
    }

    const mainImageUrl = req.files["car_main_image"] ? req.files["car_main_image"][0].path.replace(/\\/g, "/") : undefined
    const innerImageUrl = req.files["car_inner_image"] ? req.files["car_inner_image"][0].path.replace(/\\/g, "/") : undefined
    const outerImageUrl = req.files["car_outer_image"] ? req.files["car_outer_image"][0].path.replace(/\\/g, "/") : undefined

    if(!mainImageUrl || !innerImageUrl || !outerImageUrl){
      throw ErrorHandler.BadRequest("all images are required")
    }

    await CarSchema.create({name, category, tan, motor, year, color, distance, gearbox, price, description, mainImageUrl, outerImageUrl, innerImageUrl, auth: _id})

    logger.info("car added: " + name, "by: " + email)
    res.status(201).json({
      message: "added new car"
    })
  } catch (error) {
    next(error)
  }
}


// update ////////////////////////////////////////////////////////////////////////////////////
const updateCar = async (req, res, next) => {
  try {
    if(!req.user){
      throw ErrorHandler.Forbidden("you are not verified")
    }
    const {role, email} = req.user

    if(role !== "admin" && role !== "superadmin"){
      throw ErrorHandler.Forbidden("you are not admin")
    }

    const reqID = req.params.id
    const {name, category, tan, motor, year, color, distance, gearbox, price, description} = req.body

    const car = await CarSchema.findById(reqID)

    if(!car){
      throw ErrorHandler.NotFound("404 car is not found")
    }

    if(req.file){
      const mainImageUrl = req.files["car_main_image"] ? req.files["car_main_image"][0].path.replace(/\\/g, "/") : undefined
      const innerImageUrl = req.files["car_inner_image"] ? req.files["car_inner_image"][0].path.replace(/\\/g, "/") : undefined
      const outerImageUrl = req.files["car_outer_image"] ? req.files["car_outer_image"][0].path.replace(/\\/g, "/") : undefined

      if(mainImageUrl) {
        const url = path.join("../uploads/images/cars/" + car.mainImageUrl)
        if(fs.existsSync(url)) fs.unlinkSync(url)
        car.mainImageUrl = mainImageUrl
      }
      if(innerImageUrl) {
        const url = path.join("../uploads/images/cars/" + car.innerImageUrl)
        if(fs.existsSync(url)) fs.unlinkSync(url)
        car.innerImageUrl = innerImageUrl
      }
      if(outerImageUrl) {
        const url = path.join("../uploads/images/cars/" + car.outerImageUrl)
        if(fs.existsSync(url)) fs.unlinkSync(url)
        car.outerImageUrl = outerImageUrl
      }
      await car.save()
    }

    await CarSchema.findByIdAndUpdate(reqID, {name, category, tan, motor, year, color, distance, gearbox, price, description})

    logger.info("car updated: " + car.name, "by: " + email)
    res.status(201).json({
      message: "updated car"
    })
  } catch (error) {
    next(error)
  }
}


// delete ////////////////////////////////////////////////////////////////////////////////////
const deleteCar = async (req, res, next) => {
  try {
    if(!req.user){
      throw ErrorHandler.Forbidden("you are not verified")
    }

    const {_id, role, email} = req.user

    if(role !== "admin" && role !== "superadmin"){
      throw ErrorHandler.Forbidden("you are not admin")
    }

    const reqID = req.params.id

    const car = await CarSchema.findById(reqID)

    if(!car){
      throw ErrorHandler.NotFound("404 car is not found")
    }

    await CarSchema.findByIdAndDelete(reqID)

    logger.info("car deleted: " + car.name, "by: " + email)

    res.status(201).json({
      message: "deleted car"
    })
  } catch (error) {
    next(error)
  }
}


// EXPORT ////////////////////////////////////////////////////////////////////////////////////
module.exports = {
  getAllCars,
  getOneCar,
  addCar,
  updateCar,
  deleteCar
}