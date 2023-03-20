const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxlength: [30, "Name can not exceed 30 charater"],
        minlength: [4, "Name should have atleast 4 character"],
      },
      email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
      },
      password: {
        type: String,
        required: [true, "Please enter your email"],
        minlength: [8, "Passwrod should have atleast 8 character"],
        select: false,
      },
      role: {
        type: String,
        default: "user",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      }, 
      updatedAt: {
        type: Date,
        default: Date.now,
      },

})


userSchema.pre("save", async function (next) {

  if(!this.isModified("password")){
       next();
  }
  
    this.password = await bcrypt.hash(this.password, 10);
  });
  
  // JWT token
  userSchema.methods.getJWTToken = async function(){
     return await jwt.sign({id:this._id},process.env.JWT_SECRET,{
      expiresIn : process.env.JWT_EXPIRE
     })
  }
  
  // compare password
  userSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword.toString(),this.password)
  }


module.exports = mongoose.model("User", userSchema)