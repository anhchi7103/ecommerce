const mongoose = require("mongoose");
const Shop = require("./shop");

const productSchema = new mongoose.Schema({
    _id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    images: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: false,
    },
    shop_id: {
      type: String,
      required: true,
      ref: 'Shop',
    }
  }, { timestamps: true });
  
// module.exports = mongoose.model("Product", productSchema);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
