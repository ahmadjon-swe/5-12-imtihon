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
      validator: (v) => /^\/uploads\/images\/\/[a-z0-9\-]+\.(jpg|jpeg|png|webp)$/i.test(v),
      message: "URL xato formatda: https://localhost/images/....."
    }
  },
  adminInfo: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "auth"
  }
}, {
  versionKey: false,
  timestamps: true
})

const CategorySchema = model("category", Category)

module.exports = CategorySchema