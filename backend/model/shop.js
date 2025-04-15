const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
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
    },
    products: [
      {
        type: String, // or ObjectId if referencing Product model
        ref: 'Product'
      }
    ],
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  });
  
  const Shop = mongoose.model('Shop', ShopSchema);
  module.exports = Shop;
  