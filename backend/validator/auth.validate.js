const joi = require("joi")

const authValidator = data => {
  const schema = joi.object({
    username: joi.string().trim().pattern(new RegExp(/^[a-zA-Z]+$/)).required(),
    firstname: joi.string().trim().pattern(new RegExp(/^[a-zA-Z]+$/)).required(),
    lastname: joi.string().trim().pattern(new RegExp(/^[a-zA-Z]+$/)).required(),
    email: joi.string().pattern(new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)).required(),
    phoneNumber: joi.string().pattern(new RegExp(/^\+998\d{9}$/)).required(),
    password: joi.string().min(6).required()
    // role, otp, otpTime, refreshToken, savedCars foydalanuvchidan olinmaydi
  })

  return schema.validate(data)
}

module.exports = authValidator