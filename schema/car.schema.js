const {Schema, model} = require("mongoose")

const Car = new Schema({
  name: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9 &_-]+$/,
    trim: true
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "categories"
  },
  tan:{
    type: Boolean,
    required: true,
  },
  motor: {
    type: Number,
    required: true,
    min: 0.5,
    max: 8
  },
  year: {
    type: Number,
    required: true,
    min: 1970,
    max: new Date().getFullYear()
  },
  color: {
    type: String,
    required: true,
    enum: ["white", "black", "red", "blue", "gray", "silver", "yellow", "green", "brown", "orange", "purple", "other"]
  },
  distance: {
    type: Number,
    required: true,
    min: 0
  },
  gearbook: {
    type: String,
    required: true,
    enum: ["avtomat karobka", "mexanik karobka"]
  },
  price: {
    type: Number,
    required: true,
    max: 10000000000
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 25,
    maxLength: 1000
  },
  mainImageUrl: {
    type: String,
    required: true,
    match: /^uploads\/images\/cars\/[a-z0-9\-_]+\.(jpg|jpeg|png|webp|gif)$/i
  },
  outerImageUrl: {
    type: String,
    required: true,
    match: /^uploads\/images\/cars\/[a-z0-9\-_]+\.(jpg|jpeg|png|webp|gif)$/i
  },
  innerImageUrl: {
    type: String,
    required: true,
    match: /^uploads\/images\/cars\/[a-z0-9\-_]+\.(jpg|jpeg|png|webp|gif)$/i
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
  
const CarSchema = model("cars", Car)

module.exports = CarSchema