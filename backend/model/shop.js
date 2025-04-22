const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
  // _id: {
  //   type: String,
  //   required: true,
  // },
  owner_id: {
    type: String,
    required: true,
    ref: 'User' // assuming you're referencing a User model
  },
  shop_name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  }
 }, { timestamps: true });
  // bỏ refer tới product tại trong product có refer tới shop rồi


const Shop = mongoose.model('Shop', ShopSchema);
module.exports = Shop;
