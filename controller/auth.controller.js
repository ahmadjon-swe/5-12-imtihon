const ErrorHandler = require("../errors/error")
const AuthSchema = require("../schema/auth.schema")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const send_email = require("../utils/send-email")
const { access_token, refresh_token } = require("../utils/jwt")
const logger = require("../utils/logger")


// REGISTER ////////////////////////////////////////
const register = async (req, res, next)=>{
  try {
    const {username, firstname, lastname, email, password, phoneNumber} = req.body

    if(!username || !email || !password || !phoneNumber || !firstname || !lastname){
      throw ErrorHandler.BadRequest("all fields must be filled")
    }

    const foundedUsername = await AuthSchema.findOne({username})
    const foundedEmail = await AuthSchema.findOne({email})
    const foundedPhoneNumber = await AuthSchema.findOne({phoneNumber})

    if(foundedUsername || foundedEmail || foundedPhoneNumber){
      throw ErrorHandler.BadRequest("username, email or phone number is already registered")
    }

    const hash = await bcrypt.hash(password, 12)

    const otp = Array.from({length: 6}, ()=>Math.floor(Math.random()*10)).join("")

    await AuthSchema.create({username, firstname, lastname, email, password: hash, phoneNumber, otp, otpTime: Date.now()+180000})

    send_email(otp, email)

    logger.info("new user registered: " + email)
    res.status(200).json({message: "please check your email"})
  } catch (error) {
    next(error)
  }
}

// LOGIN ////////////////////////////////////////
const  login = async (req, res, next)=>{
  try {
    const {email, password} = req.body

    if(!email || !password){
      throw ErrorHandler.BadRequest("email and password are required")
    }

    const foundedEmail = await AuthSchema.findOne({email})

    if(!foundedEmail){
      throw ErrorHandler.NotFound("user not found")
    }

    const check = await bcrypt.compare(password, foundedEmail.password)

    if(!check){
      throw ErrorHandler.BadRequest("password is incorrect")
    }

    const otp = Array.from({length: 6}, ()=>Math.floor(Math.random()*10)).join("")

    await AuthSchema.findByIdAndUpdate(foundedEmail._id, {otp, otpTime: Date.now()+180000})

    send_email(otp, email)

    res.status(201).json({
      message: "check your email"
    })

  } catch (error) {
    next(error)
  }
}

// LOGOUT ////////////////////////////////////////
const logout = async (req, res, next)=>{
  try {
    const email = req["user"]?.email

    if(!email){
      throw ErrorHandler.BadRequest("you are not logged in")
    }

    const foundedEmail = await AuthSchema.findOne({email})

    if(!foundedEmail){
      throw ErrorHandler.NotFound("user not found")
    }

    foundedEmail.refreshToken = ""
    await foundedEmail.save()

    res.clearCookie("refresh_token")

    logger.info("user logged out: " + foundedEmail.email)
    res.status(200).json({message: "successfully logged out"})
  } catch (error) {
    next(error)
  }
}

// VERIFY ////////////////////////////////////////
const verify = async (req, res, next)=>{
  try {
    const {email, otp} = req.body

    if(!otp || !email){
      throw ErrorHandler.BadRequest("otp and email are required")
    }

    const foundedEmail = await AuthSchema.findOne({email})

    if(!foundedEmail){
      throw ErrorHandler.NotFound("User not found")
    }

    if(!foundedEmail.otp){
      throw ErrorHandler.NotFound("otp not found, login again")
    }

    if(foundedEmail.otpTime < Date.now()){
      throw ErrorHandler.Forbidden("otp expired")
    }

    if(foundedEmail.otp != otp){
      throw ErrorHandler.BadRequest("otp is incorrect")
    }

    const payload = {
      _id: foundedEmail._id,
      email: foundedEmail.email,
      role: foundedEmail.role,
      phoneNumber: foundedEmail.phoneNumber
    }

    const accessToken = access_token(payload)
    const refreshToken = refresh_token(payload)

    await AuthSchema.findByIdAndUpdate(foundedEmail._id, {otp: "", otpTime: 0, refreshToken})

    res.cookie("refresh_token", 
      refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 24 *  60 * 60 * 1000 // 2 oy
      })
    
    logger.info("user logged in: " + foundedEmail.email)
    res.status(201).json({
      message: "logged in succesfully",
      token: accessToken
    })
  } catch (error) {
    next(error)
  }
}

// DELETE ////////////////////////////////////////
const delete_account = async (req, res, next)=>{
  try {
    const id = req.user?._id

    if(!id){
      throw ErrorHandler.Forbidden("you are not verified!")
    }

    const {password} = req.body

    if(!password){
      throw ErrorHandler.BadRequest("password is required")
    }
    
    const user = await AuthSchema.findById(id)
    
    
    if(!user){
      throw ErrorHandler.NotFound("user not found")
    }
    

    const check = await bcrypt.compare(password, user.password)
    
    if(!check){
      throw ErrorHandler.BadRequest("password is incorrect")
    }

    logger.info("user deleted: " + user.email)
    await AuthSchema.findByIdAndDelete(id)

    res.status(201).json({message: "account deleted successfully"})
  } catch (error) {
    next(error)
  }
}

// CHANGE PASSWORD ////////////////////////////////////////
const change_password = async (req, res, next)=>{
  try {
    if(!req.user){
      throw ErrorHandler.Forbidden("you are not verified")
    }
    const {_id, email} = req.user

    if(!email || !_id){
      throw ErrorHandler.BadRequest("email and _id not found")
    }

    const {oldPassword, newPassword} = req.body


    if(!oldPassword || !newPassword){
      throw ErrorHandler.BadRequest("old and new passwords are required")
    }

    const user = await AuthSchema.findOne({email})
    
    if(!user){
      throw ErrorHandler.NotFound("user is not found")
    }

    const check = await bcrypt.compare(oldPassword, user.password)
    
    if(!check){
      throw ErrorHandler.BadRequest("Old password is incorrect")
    }

    const hash = await bcrypt.hash(newPassword, 12)

    user.password = hash
    await user.save()

    logger.info("password updated: " + _id)
    res.status(201).json({message: "password is updated"})

  } catch (error) {
    next(error)
  }
}

// FORGOT PASSWORD ////////////////////////////////////////
const forgot_password = async (req, res, next)=>{
  try {
    const {email} = req.body

    if(!email){
      throw ErrorHandler.BadRequest("email is required")
    }

    const foundedEmail = await AuthSchema.findOne({email})

    if(!foundedEmail){
      throw ErrorHandler.NotFound("user is not found")
    }

    const otp = Array.from({length: 6}, ()=>Math.floor(Math.random()*10)).join("")

    foundedEmail.otp = otp
    foundedEmail.otpTime = Date.now() + 60000
    await foundedEmail.save()

    send_email(otp, email)

    res.status(201).json({message: "please verify your email, in order to change your password"})


  } catch (error) {
    next(error)
  }
}

// FORGOT PASSWORD VERIFY ////////////////////////////////////////
const forgot_password_verify = async (req, res, next)=>{
  try {
    const {otp, email, newPassword} = req.body

    if(!otp || !email || !newPassword){
      throw ErrorHandler.BadRequest("otp and email are required")
    }

    const foundedEmail = await AuthSchema.findOne({email})

    if(!foundedEmail){
      throw ErrorHandler.NotFound("User not found")
    }

    if(!foundedEmail.otp){
      throw ErrorHandler.NotFound("otp not found, login again")
    }

    if(foundedEmail.otpTime < Date.now()){
      throw ErrorHandler.Forbidden("otp expired")
    }

    if(foundedEmail.otp != otp){
      throw ErrorHandler.BadRequest("otp is incorrect")
    }

    const hash = await bcrypt.hash(newPassword, 12)

    await AuthSchema.findByIdAndUpdate(foundedEmail._id, {otp: "", otpTime: 0, password: hash}) 
    
    logger.info("password updated: " + email)
    res.status(201).json({
      message: "password updated successfully"
    })


  } catch (error) {
    next(error)
  }
}

// RESEND OTP ////////////////////////////////////////
const resend_otp = async (req, res, next)=>{
  try {
    const {email} = req.body

    if(!email){
      throw ErrorHandler.BadRequest("email is required")
    }
    
    const user =  await AuthSchema.findOne({email})
    
    if(!user){
      throw ErrorHandler.NotFound("user not found")
    }

    if(!user.otp || user.otp===""){
      throw ErrorHandler.Forbidden("you have to try to login first")
    }
    
    const otp = Array.from({length: 6}, ()=>Math.floor(Math.random()*10)).join("")

    user.otp = otp
    user.otpTime = Date.now() + 60000
    await user.save()

    send_email(otp, email)

    res.status(201).json({message: "otp has been resended"})
  } catch (error) {
    next(error)
  }
}


module.exports = {
  register,
  login,
  logout,
  verify,
  delete_account,
  resend_otp,
  change_password,
  forgot_password,
  forgot_password_verify
}