const {Schema, model} = require("mongoose")

const Auth = new Schema({
  username: {
    type: String,
    required: true,
    match: /^[a-zA-Z]+$/,
    trim: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    match: /^[a-zA-Z]+$/,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    match: /^[a-zA-Z]+$/,
    minLength: 3,
    maxLength: 50,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^\+998\d{9}$/
  },
  password: {
    type: String,
    required: true,
    minLength: 60 // bcryptjs 60 ta qaytaradi
  },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user"
  },
  otp: {
    type: String,
    required: true
  },
  otpTime: {
    type: Number,
    required: true
  },
  refreshToken: {
    type: String
  }
}, {
  versionKey: false,
  timestamps: true
})

const AuthSchema = model("auth", Auth)

module.exports = AuthSchema