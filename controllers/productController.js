const Product = require('../models/productModel');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");




// create product---Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  console.log(123)
  req.body.user = req.user.id;
    
    const product = await Product.create(req.body);
  
    res.status(201).json({
      success: true,
      product,
    });
  });


  // get all products
exports.getAllProducts = catchAsyncError(async (req, res) => {
    let page = req.query.page ? req.query.page : 1
    let limit = process.env.limit ? process.env.limit : 10
    let offset = (page - 1) * limit
    let filter = {}
    if(req.query.category) {
      filter.category = { $regex: '.*' + req.query.category + '.*' }
    }
    if(req.query.name) {
      filter.name = { $regex: '.*' + req.query.name + '.*' }
    }
    if(req.query.minPrice && req.query.maxPrice) {
      filter.price = {$gte: req.query.minPrice, $lte: req.query.maxPrice  }
    }
    let products = await Product.find(filter).skip(offset).limit(limit)
    const productCount = await Product.countDocuments(filter);
    res.status(201).json({
      success: true,
      products,
      productCount,
    });
  });

  // Updated product--Admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorHandler("product not found", 404));
    }
  
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      product,
    });
  });

  // delete product----Admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("product not found", 404));
    }
    await product.deleteOne({_id: req.params.id});
    return res.status(200).json({
      success: true,
      message: "product deleted successfully",
    });
  });

    // get Single product----Admin
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  
  return res.status(200).json({
    success: true,
    product,
  });
});