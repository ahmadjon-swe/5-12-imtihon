const ErrorHandler = require("../errors/error")
const CarSchema = require("../schema/car.schema")
const CategorySchema = require("../schema/category.schema")
const fs = require("fs")
const path = require("path")
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

// get_all ////////////////////////////////////////////////////////////////////////////////////
const getMyCars = async (req, res, next) => {
  try {
    
    if(!req.user){
      throw ErrorHandler.Forbidden("you are not verified")
    }

    const {_id, role} = req.user

    if(role !== "admin" && role !== "superadmin"){
      throw ErrorHandler.Forbidden("you are not admin")
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ""
    const sort = req.query.sort || "createdAt"
    
    const skip = (page-1) * limit
    
    const query = {adminInfo: _id}

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

    const {name, category, tan, motor, year, color, distance, gearbook, price, description} = req.body

    const foundedCategory = await CategorySchema.findOne({name: category})

    if(!foundedCategory){
      throw ErrorHandler.BadRequest("category must be real")
    }



    if(!name || !category || tan === undefined || !motor || !year || !color || distance === undefined || !gearbook || !price || !description){
      throw ErrorHandler.BadRequest("all fields are required")
    }

    if(!req.files){
      throw ErrorHandler.BadRequest("images are required")
    }

    const mainImageUrl = req.files["car_main_image"] ? req.files["car_main_image"][0].path.replace(/\\/g, "/") : undefined
    const innerImageUrl = req.files["car_inner_image"] ? req.files["car_inner_image"][0].path.replace(/\\/g, "/") : undefined
    const outerImageUrl = req.files["car_outer_image"] ? req.files["car_outer_image"][0].path.replace(/\\/g, "/") : undefined

    if(!mainImageUrl || !innerImageUrl || !outerImageUrl){
      throw ErrorHandler.BadRequest("all images are required")
    }

    await CarSchema.create({name, category: foundedCategory._id, tan, motor, year, color, distance, gearbook, price, description, mainImageUrl, outerImageUrl, innerImageUrl, adminInfo: _id})

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
    const {name, category, tan, motor, year, color, distance, gearbook, price, description} = req.body
    const query = {name, tan, motor, year, color, distance, gearbook, price, description}

     const foundedCategory = await CategorySchema.findOne({name: category})

    if(category && !foundedCategory){
      throw ErrorHandler.BadRequest("category must be real")
    }else if(category){
      query.category = foundedCategory._id
    }


    const car = await CarSchema.findById(reqID)

    if(!car){
      throw ErrorHandler.NotFound("404 car is not found")
    }

    if(req.files){
      const mainImageUrl = req.files["car_main_image"] ? req.files["car_main_image"][0].path.replace(/\\/g, "/") : undefined
      const innerImageUrl = req.files["car_inner_image"] ? req.files["car_inner_image"][0].path.replace(/\\/g, "/") : undefined
      const outerImageUrl = req.files["car_outer_image"] ? req.files["car_outer_image"][0].path.replace(/\\/g, "/") : undefined

      if(mainImageUrl) {
        const url = path.join(__dirname, "..", car.mainImageUrl)
        query.mainImageUrl = mainImageUrl
        if(fs.existsSync(url)) fs.unlinkSync(url)
      }
      if(innerImageUrl) {
        const url = path.join(__dirname, "..", car.innerImageUrl)
        query.innerImageUrl = innerImageUrl
        if(fs.existsSync(url)) fs.unlinkSync(url)
      }
      if(outerImageUrl) {
        const url = path.join(__dirname, "..", car.outerImageUrl)
        query.outerImageUrl = outerImageUrl
        if(fs.existsSync(url)) fs.unlinkSync(url)
      } 
    }

    await CarSchema.findByIdAndUpdate(reqID, query, {new: true})

    logger.info("car updated: " + car.name, "by: " + email)
    res.status(200).json({
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

    const {role, email} = req.user

    if(role !== "admin" && role !== "superadmin"){
      throw ErrorHandler.Forbidden("you are not admin")
    }

    const reqID = req.params.id

    const car = await CarSchema.findById(reqID)



    if(!car){
      throw ErrorHandler.NotFound("404 car is not found")
    }

    let imagePath = path.join(__dirname, "..", car.mainImageUrl)
    if(fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
    imagePath = path.join(__dirname, "..", car.outerImageUrl)
    if(fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
    imagePath = path.join(__dirname, "..", car.innerImageUrl)
    if(fs.existsSync(imagePath)) fs.unlinkSync(imagePath)

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
  getMyCars,
  getOneCar,
  addCar,
  updateCar,
  deleteCar
}