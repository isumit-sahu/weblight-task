const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter product description name"],
    trim: true,
  },
  price: {
    type: String,
    required: [true, "Please enter product price"],
    maxLength: [8, "Price can not exceed 8 character"],
  },
  category: {
    type: String,
    required: [true, "Please enter product category"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
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

module.exports = mongoose.model("Product", productSchema)