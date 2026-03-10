const {Schema, model} = require("mongoose")

const Save = new Schema({
  carInfo: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "cars"
  },
  userInfo: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "auths"
  },
  isSaved: {
    type: Boolean,
    default: true
  }
},{
  versionKey: false,
  timestamps: true
})

const SaveSchema = model("saves", Save)

module.exports = SaveSchema