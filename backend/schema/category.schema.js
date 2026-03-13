const {Schema, model} = require("mongoose")

const Category = new Schema({
  name: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9 &_-]+$/,
    trim: true,
    unique: true
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^uploads\/images\/categories\/[a-z0-9\-_]+\.(jpg|jpeg|png|webp|gif)$/i.test(v)
    }
  },
  adminInfo: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "auths"
  }
}, {
  versionKey: false,
  timestamps: true
})

const CategorySchema = model("categories", Category)

module.exports = CategorySchema