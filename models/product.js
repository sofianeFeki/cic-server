const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    Title: { type: String, required: true },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    Description: { type: String, required: true },
    Price: { type: Number, required: true },
    Image: { type: String },
    Quantity: { type: Number, required: true },
    sold: { type: Number },
    isProductOfTheYear: { type: Boolean, default: false },
    color: { type: String },
    Brand: { type: String },
    Category: { type: String },
    subCategory: { type: String },
    ficheTech: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    pdf: { type: String },
    video: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
