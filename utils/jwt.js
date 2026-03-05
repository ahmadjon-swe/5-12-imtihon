const jwt = require("jsonwebtoken")

const access_token = (payload) => jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "15m"})

const refresh_token = (payload) => jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {expiresIn: "60d"})

module.exports = {access_token, refresh_token}