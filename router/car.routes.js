const {Router} = require("express")
const authorization = require("../middleware/authorization")
const { getAllCars, getOneCar, addCar, updateCar, deleteCar, getMyCars } = require("../controller/car.controller")
const { saveCar, clearUnsavedCars, getSavedCars } = require("../controller/save.controller")
const { uploadCarImage } = require("../middleware/upload-image")

const carRouter = Router()

carRouter.get("/get_all_cars", getAllCars)
carRouter.get("/get_my_cars", authorization, getMyCars)
carRouter.get("/get_one_car/:id", getOneCar)
carRouter.post("/add_car", authorization, uploadCarImage.fields([{name: "car_main_image", maxCount: 1}, {name: "car_inner_image", maxCount: 1}, {name: "car_outer_image", maxCount: 1}]), addCar)
carRouter.put("/update_car/:id",authorization, uploadCarImage.fields([{name: "car_main_image", maxCount: 1}, {name: "car_inner_image", maxCount: 1}, {name: "car_outer_image", maxCount: 1}]), updateCar)
carRouter.delete("/delete_car/:id",authorization, deleteCar )

// SAVE ROUTE
carRouter.post("/save_car/:id", authorization, saveCar)
carRouter.get("/get_saved_cars", authorization, getSavedCars)
carRouter.delete("/clear_unsaved_car/", authorization, clearUnsavedCars)

module.exports = carRouter

