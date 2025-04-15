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
const PORT = process.env.PORT;

const Product = require("./model/product");
const User = require("./model/user");
const Shop = require("./model/shop");

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
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

// Creating endpoint for registering the user
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

//cart
app.use("/cart", require("./routes/cartRoute"));