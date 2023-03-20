const ErrorHandler = require("../utils/errorHandler");


module.exports = (err,req,res,next) => {
err.statusCode = err.statusCode || 500,
err.message = err.message || "Internal server error";
console.log(err)
// wrong mongo db id error
if(err.name === "cast error"){
    const message = `Resources not found. Invalid : ${err.path}`
     err = new ErrorHandler(message,400)
}

// mongoose duplicate key error
if(err.code === 11000){
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`
     err = new ErrorHandler(message,400)
}

// JWT error
if(err.code === "JsonWebTokenError"){
    const message = `Json Web Token is Invalid, Try again`
     err = new ErrorHandler(message,400)
}

// JWT Expire Error
if(err.code === "JsonWebTokenExpireError"){
    const message = `Json Web Token is Expired, Try again`
     err = new ErrorHandler(message,400)
}

res.status(err.statusCode).json({
    success : false,
    error : err.message
})
}