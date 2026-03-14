const ErrorHandler = require("../errors/error");
const CarSchema = require("../schema/car.schema");
const CategorySchema = require("../schema/category.schema");
const path = require("path")
const fs = require("fs");
const logger = require("../utils/logger");

// get_all ////////////////////////////////////////////////////////////////////////////////////
const getAllCategories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const sort = req.query.sort || "createdAt";

    const skip = (page - 1) * limit;

    const query = {};

    if (search.trim()) {
      query.name = {$regex: search, $options: "i"};
    }

    const total = await CategorySchema.countDocuments(query);
    const categories = await CategorySchema.find(query)
      .populate("adminInfo")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (!categories) {
      throw ErrorHandler.NotFound("404 categories are not found");
    }

    res.status(200).json({
      totalPage: Math.ceil(total / limit),
      prev: page > 1 ? {page: page - 1, limit} : undefined,
      next: total > page * limit ? {page: page + 1, limit} : undefined,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// get_all ////////////////////////////////////////////////////////////////////////////////////
const getMyCategories = async (req, res, next) => {
  try {
    if (!req.user) {
      throw ErrorHandler.Forbidden("you are not verified");
    }

    const {_id, role} = req.user;

    if (role !== "admin" && role !== "superadmin") {
      throw ErrorHandler.Forbidden("you are not admin");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const sort = req.query.sort || "createdAt";

    const skip = (page - 1) * limit;

    const query = {adminInfo: _id};

    if (search.trim()) {
      query.name = {$regex: search, $options: "i"};
    }

    const total = await CategorySchema.countDocuments(query);
    const categories = await CategorySchema.find(query)
      .populate("adminInfo")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (!categories) {
      throw ErrorHandler.NotFound("404 categories are not found");
    }

    res.status(200).json({
      totalPage: Math.ceil(total / limit),
      prev: page > 1 ? {page: page - 1, limit} : undefined,
      next: total > page * limit ? {page: page + 1, limit} : undefined,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// get_one ////////////////////////////////////////////////////////////////////////////////////
const getOneCategory = async (req, res, next) => {
  try {
    const reqID = req.params.id;
    const category = await CategorySchema.findById(reqID);

    if (!category) {
      throw ErrorHandler.NotFound("404 category is not found");
    }

    const cars = await CarSchema.find({category: reqID})
    res.status(200).json({category, cars});
  } catch (error) {
    next(error);
  }
};

// add ////////////////////////////////////////////////////////////////////////////////////
const addCategory = async (req, res, next) => {
  try {
    if (!req.user) {
      throw ErrorHandler.Forbidden("you are not verified");
    }

    const {_id, role, email} = req.user;

    if (role !== "admin" && role !== "superadmin") {
      throw ErrorHandler.Forbidden("you are not admin");
    }

    const {name} = req.body;

    if (!name) {
      throw ErrorHandler.BadRequest("name is required");
    }

    const foundedCategory = await CategorySchema.findOne({name});

    if (foundedCategory) {
      throw ErrorHandler.BadRequest("category already exists");
    }

    if (!req.file) {
      throw ErrorHandler.BadRequest("image is required");
    }

    const imageUrl = req.file.path.replace(/\\/g, "/");
    await CategorySchema.create({name, adminInfo: _id, imageUrl});

    logger.info("category added: " + name, "by: " + email);
    res.status(201).json({
      message: "added new category",
    });
  } catch (error) {
    next(error);
  }
};

// update ////////////////////////////////////////////////////////////////////////////////////
const updateCategory = async (req, res, next) => {
  try {
    if (!req.user) {
      throw ErrorHandler.Forbidden("you are not verified");
    }
    const {email, role} = req.user;

    if (role !== "admin" && role !== "superadmin") {
      throw ErrorHandler.Forbidden("you are not admin");
    }

    const reqID = req.params.id;
    const {name} = req.body;

    const category = await CategorySchema.findById(reqID);

    if (!category) {
      throw ErrorHandler.NotFound("404 category is not found");
    }

    if (req.file) {
      const url = category.imageUrl;
      if (fs.existsSync(url)) {
        fs.unlinkSync(url);
      }
      const imageUrl = req.file.path.replace(/\\/g, "/");
      category.imageUrl = imageUrl;
    }

    if (name) {
      category.name = name;
    }
    await category.save();

    logger.info("category updated: " + category.name, "by: " + email);
    res.status(201).json({
      message: "updated category",
    });
  } catch (error) {
    next(error);
  }
};

// delete ////////////////////////////////////////////////////////////////////////////////////
const deleteCategory = async (req, res, next) => {
  try {
    if (!req.user) {
      throw ErrorHandler.Forbidden("you are not verified");
    }

    const {email, role} = req.user;

    if (role !== "admin" && role !== "superadmin") {
      throw ErrorHandler.Forbidden("you are not admin");
    }

    const reqID = req.params.id;

    const category = await CategorySchema.findById(reqID);

    if (!category) {
      throw ErrorHandler.NotFound("404 category is not found");
    }

    const imagePath = path.join(__dirname, "..", category.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await CategorySchema.findByIdAndDelete(reqID);

    logger.info("category deleted: " + category.name, "by: " + email);

    res.status(201).json({
      message: "deleted category",
    });
  } catch (error) {
    next(error);
  }
};

// EXPORT ////////////////////////////////////////////////////////////////////////////////////
module.exports = {
  getAllCategories,
  getMyCategories,
  getOneCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};
