const {Router} = require("express")
const authorization = require("../middleware/authorization")
const { addCategory, updateCategory, deleteCategory, getOneCategory, getAllCategorys } = require("../controller/category.controller")

const categoryRouter = Router()

categoryRouter.get("/get_all_categorys", getAllCategorys)
categoryRouter.get("/get_one_category/:id", getOneCategory)
categoryRouter.post("/add_category", authorization, addCategory)
categoryRouter.put("/update_category/:id",authorization, updateCategory)
categoryRouter.delete("/delete_category/:id",authorization, deleteCategory )

module.exports = categoryRouter