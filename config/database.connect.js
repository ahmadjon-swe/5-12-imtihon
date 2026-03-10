const mongoose = require("mongoose")
const logger = require("../utils/logger")

function connectDataBase(){
  mongoose.connect(process.env.MONGO_URL)
  .then(()=>console.log("connected to data base"))
  .catch((err) => {
  logger.error(err.message)
  process.exit(1)
})
}

module.exports = connectDataBase