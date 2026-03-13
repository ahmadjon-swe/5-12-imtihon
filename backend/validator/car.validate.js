const joi = require("joi")

const carValidator = (data => {
  const schema = joi.object({
    name: joi.string().min(3).max(50).required(),
    category: joi.string().required(),
    tan: joi.boolean().required(),
    motor: joi.number().min(0.5).max(8).required(),
    year: joi.number().integer().min(1970).max(new Date().getFullYear()).required(),
    color: joi.string().valid("white", "black", "red", "blue", "gray", "silver", "yellow", "green", "brown", "orange", "purple", "other").required(),
    distance: joi.number().min(0).required(),
    gearbook: joi.string().valid("avtomat karobka", "mexanik karobka").required(),
    price: joi.number().max(10000000000).required(),
    description: joi.string().min(25).max(1000)
  })

  return schema.validate(data)
})

module.exports = carValidator