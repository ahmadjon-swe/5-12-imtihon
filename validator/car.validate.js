const joi = require("joi")

const carValidator = (data => {
  const schema = joi.object({
    name: joi.string().min(3).max(50),
    category: joi.string().hex().length(24),
    tan: joi.boolean(),
    motor: joi.number().min(0.5).max(8),
    year: joi.number().integer().min(1970).max(new Date().getFullYear()),
    color: joi.string().valid("white", "black", "red", "blue", "gray", "silver", "yellow", "green", "brown", "orange", "purple", "other"),
    distance: joi.number().min(0),
    gearbox: joi.number().integer().min(4).max(8),
    price: joi.number().max(10000000000),
    description: joi.string().min(25).max(1000)
  })

  return schema.validate(data)
})

module.exports = carValidator