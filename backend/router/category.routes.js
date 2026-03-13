const {Router} = require("express")
const authorization = require("../middleware/authorization")
const { addCategory, updateCategory, deleteCategory, getOneCategory, getAllCategories, getMyCategories } = require("../controller/category.controller")
const { uploadCategoryImage } = require("../middleware/upload-image")

const categoryRouter = Router()

categoryRouter.get("/get_all_categories", getAllCategories)
categoryRouter.get("/get_my_categories", authorization, getMyCategories)
categoryRouter.get("/get_one_category/:id", getOneCategory)
categoryRouter.post("/add_category", authorization, uploadCategoryImage.single("category_image"), addCategory)
categoryRouter.put("/update_category/:id",authorization, uploadCategoryImage.single("category_image"), updateCategory)
categoryRouter.delete("/delete_category/:id",authorization, deleteCategory )

module.exports = categoryRouter