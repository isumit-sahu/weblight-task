const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken")
// register a user

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
  
    const user = await User.create({
      name,
      email,
      password,
    });
    
    res.status(200).json({
      success : true,
      user,
    })
    
    sendToken(user, 200, res);
    
  });
  
  // login  user
  
  exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    // checking if user have given both email and password
  
    if (!email || !password) {
      return next(new ErrorHandler("Please enter Email & Password"), 400);
    }
    
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorHandler("Incorrect email and password"), 401);
    }
  
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Incorrect email and password"), 401);
    }
    
    sendToken(user, 200, res);
  });


  // Get user details
exports.getUserDetails = catchAsyncError(async(req,res,next) => {

    const user = await User.findById(req.user.id)
    
     
    res.status(200).json({
      success : true,
      user,
    })
  })


  // get all user (admin)
exports.getAllUsers = catchAsyncError(async(req,res,next) => {
    let page = req.query.page ? req.query.page : 1
    let limit = process.env.limit ? process.env.limit : 10
    let offset = (page - 1) * limit
    const users
     = await User.find({
        role: 'user'
    }).skip(offset).limit(limit)

    const userCount
     = await User.countDocuments({
        role: 'user'
    })
  
    res.status(200).json({
      success : true,
      users,
      userCount
    })
  })


  
// Get single user (admin)
exports.getSingleUser = catchAsyncError(async(req,res,next) => {

    const user = await User.findOne({_id:req.params.id, role: 'user'})
     
    if(!user){
      return next(new ErrorHandler(`User does not exist with id ${req.params.id}`))
    }
  
    res.status(200).json({
      success : true,
      user,
    })
  })
  
  // delete user (admin)
  exports.deleteUser = catchAsyncError(async(req,res,next) => {
  
   
    const user = await User.findOne({_id:req.params.id, role: 'user'})
   
    // we will remove cloudinary later
  
    if(!user){
      return next(new ErrorHandler(`user does not exist with id ${req.params.id}`))
    }
  
    user.deleteOne({_id:req.params.id, role: 'user'})
  
    res.status(200).json({
      success : true,
      message :"user deleted successfully"
    })
  })
  