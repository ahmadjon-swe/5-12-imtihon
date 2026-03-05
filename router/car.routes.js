const {Router} = require("express")
const authorization = require("../middleware/authorization")

const carRouter = Router()

carRouter.get("/get_all_cars", getAllCars)
carRouter.get("/get_one_car/:id", getOneCar)
carRouter.post("/add_car", authorization, addCar)
carRouter.put("/update_car/:id",authorization, updateCar)
carRouter.delete("/delete_car/:id",authorization, deleteCar )

module.exports = carRouter

