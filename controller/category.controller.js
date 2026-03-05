const CustomErrorHandler = require("../error/custom-error.handler")
const CategorySchema = require("../schema/category.schema")

// get_all ////////////////////////////////////////////////////////////////////////////////////
const getAllCategorys = async (req, res, next) => {
  try {
    const categorys = await CategorySchema.find().populate("authorInfo", "-_id fullname period work")

    if(!categorys){
      throw CustomErrorHandler.NotFound("404 categorys are not found")
    }

    res.status(200).json(categorys)
  } catch (error) {
    next(error)
  }
}


// get_one ////////////////////////////////////////////////////////////////////////////////////
const getOneCategory = async (req, res, next) => {
  try {
    const reqID = req.params.id
    const category = await CategorySchema.findById(reqID).populate("authorInfo")

    if(!category){
      throw CustomErrorHandler.NotFound("404 category is not found")
    }

    res.status(200).json(category)
  } catch (error) {
    next(error)
  }
}


// add ////////////////////////////////////////////////////////////////////////////////////
const addCategory = async (req, res, next) => {
  try {
    const {title, pages, publishedYear, publishedHome, period, description, genre, imageUrl, authorInfo}= req.body

    if(!title || !pages || !publishedYear || !publishedHome || !period || !description || !genre || !imageUrl || !authorInfo){
      throw CustomErrorHandler.BadRequest("all fields must be filled in")
    }

    await CategorySchema.create({title, pages, publishedYear, publishedHome, period, description, genre, imageUrl, authorInfo})

    res.status(201).json({
      message: "added new category"
    })
  } catch (error) {
    next(error)
  }
}


// update ////////////////////////////////////////////////////////////////////////////////////
const updateCategory = async (req, res, next) => {
  try {
    const reqID = req.params.id
    const {title, pages, publishedYear, publishedHome, period, description, genre, imageUrl, authorInfo}= req.body

    const category = await CategorySchema.findById(reqID)

    if(!category){
      throw CustomErrorHandler.NotFound("404 category is not found")
    }
    
    await CategorySchema.findByIdAndUpdate(reqID, {title, pages, publishedYear, publishedHome, period, description, genre, imageUrl, authorInfo})

    res.status(201).json({
      message: "updated category"
    })
  } catch (error) {
    next(error)
  }
}


// delete ////////////////////////////////////////////////////////////////////////////////////
const deleteCategory = async (req, res, next) => {
  try {
    const reqID = req.params.id

    const category = await CategorySchema.findById(reqID)

    if(!category){
      throw CustomErrorHandler.NotFound("404 category is not found")
    }

    await CategorySchema.findByIdAndDelete(reqID)

    res.status(201).json({
      message: "deleted category"
    })
  } catch (error) {
    next(error)
  }
}


// EXPORT ////////////////////////////////////////////////////////////////////////////////////
module.exports = {
  getAllCategorys,
  getOneCategory,
  addCategory,
  updateCategory,
  deleteCategory
}