const mongoose = require("mongoose")

function connectDataBase(){
  mongoose.connect(process.env.MONGO_URL)
  .then(()=>console.log("connected to data base"))
  .catch((err)=>console.log(err.message))
}

module.exports = connectDataBase