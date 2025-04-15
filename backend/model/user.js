const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  address_id: String,
  street: String,
  city: String,
  country: String,
});

const paymentMethodSchema = new mongoose.Schema({
  method_id: String,
  type: String,
  details: String,
});

const userSchema = new mongoose.Schema({
  username:
  {
    type: String,
    required: true, 
    unique: true
  },
  password_hash:
  {
    type: String,
    required: true
  },
  email:
  {
    type: String,
    required: true, 
    unique: true
  },

  address: [addressSchema], // Embedded array of address documents

  rank: {
    type: String, default: 'normal'
  },

  payment_methods: [paymentMethodSchema], // Embedded array of payment method documents

  wishlist: [{ type: String }], // Array of product ID strings (or ObjectIds if you link to Products)

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },

  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
