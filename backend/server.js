const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const redisClient = require('./model/dbConfig');
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const { error } = require("console");

require("dotenv").config();

const app = express();
const REDIS_PORT = process.env.REDIS_PORT;
const MONGODB_PORT = process.env.MONGODB_PORT;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

app.get('/cache-test', async (req, res) => {
  try {
    await redisClient.set('message', 'Hello from Redis!', {
      EX: 60, // expires in 60 seconds
    });

    const value = await redisClient.get('message');
    res.send(value);
  } catch (err) {
    console.error('Redis error:', err);
    res.status(500).send('Something went wrong');
  }
});

app.listen(REDIS_PORT, () => {
  console.log(`Server is running on http://localhost:${REDIS_PORT}`);
});

app.listen(MONGODB_PORT, () => {
  console.log(`Server is running on http://localhost:${MONGODB_PORT}`);
});

//image storage engine
const storage = multer.diskStorage(
  {
    destination: './upload/images',
    filename: (req, file, cb) => {
      return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
  }
)

const upload = multer({ storage: storage })
//creating upload endpoint for images
app.use('/images', express.static('upload/images'))
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${MONGODB_PORT}/images/${req.file.filename}`
  })
})

const Product = mongoose.model("Product", {
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
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
})

app.post('/addproduct', async (req, res) => {
  let products = await Product.find({});
  let id; 
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = Number(last_product._id) + 1;
  }
  else {
    id = 1;
  }
  const product = new Product({
    _id: id,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    category: req.body.category,
    images: req.body.images,
    rating: req.body.rating,
    shop_id: req.body.shop_id,
    created_at: req.body.created_at
  })
  console.log(product);
  await product.save();
  console.log("save");
  res.json({
    success: true,
    name: req.body.name
  })
})

app.post('/deleteproduct', async (req, res) => {
  await Product.findOneAndDelete({ _id: req.body._id });
  res.json({
    success: true,
  })
  console.log(req.body);
})

app.get('/get-allproducts', async (req, res) => {
  let products = await Product.find({});
  console.log("All products fetched.");
  res.send(products);
})

//User
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


// Creare=ing endpoint for registering the user
app.post('/signup', async(req, res) => {
  let check = await User.findOne({email: req.body.email});
  if(check) {
    return res.status(400).json({success: false, errors: "Existing user found with same email adress"});
  }
  
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password_hash: req.body.password_hash,
    
  })
  await user.save();

  const data = {
    user: {
      id: user._id
    }
  }
  const token = jwt.sign(data, 'secret_ecom')
  res.json({success: true, token})
})

// Creating endpoint for user login
app.post('/login', async (req, res) => {
  let user = await User.findOne({email:req.body.email});
  if (user) {
    const passMatch = req.body.password_hash === user.password_hash;
    if (passMatch) {
      const data = {
        user: {
          id: user._id
        }
      }
      const token = jwt.sign(data, 'secret_ecom');
      res.json({success:true, token});
    } else {
      res.json({success:false, errors:"Wrong password"});
    }
  } else {
    res.json({success:false, errors: "Wrong email adress"})
  }
})