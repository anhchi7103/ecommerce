const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const { error } = require("console");

const redisClient = require('./middleware/dbConfig');
const { connectCassandra } = require('./middleware/cassandra');

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

const Product = require("./model/product");
const User = require("./model/user");
const Shop = require("./model/shop");

app.use(cors());
app.use(express.json());

//QChi
const order = require("./routes/orderRoute");

app.use(cors());
app.use(express.json());

//QChi
app.use("/api/orders", order);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

connectCassandra();

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
    image_url: `http://localhost:${PORT}/images/${req.file.filename}`
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
app.post('/signup', async (req, res) => {
  try {
    const { email, username, first_name, last_name, phone_number, password_hash } = req.body;

    // Basic validation
    if (!email || !username || !password_hash || !first_name || !last_name || !phone_number) {
      return res.status(400).json({ success: false, errors: "All fields are required" });
    }

    let check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({ success: false, errors: "Existing user found with same email address" });
    }

    // Khởi tạo giỏ hàng 300 sản phẩm với số lượng = 0
    // let cart = {};
    // for (let i = 0; i < 300; i++) {
    //   cart[i] = 0;
    // }

    const user = new User({
      username,
      email,
      password_hash,
      first_name,
      last_name,
      phone_number,
      // cart_data: cart,
      address: req.body.address || [],
      payment_methods: req.body.payment_methods || [],
      wishlist: req.body.wishlist || [],
      rank: req.body.rank || 'regular'
    });

    await user.save();

    // const data = { 
    //   user: { 
    //     id: user._id 
    //   }};
    // const token = jwt.sign(data, 'secret_ecom');
    res.status(201).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Creating endpoint for user login
app.post('/login', async (req, res) => {
  let user = await User.findOne({email:req.body.email});
  if (user) {
    const passMatch = req.body.password_hash === user.password_hash;
    if (passMatch) {
      return res.json({
        success: true,
        userId: user._id
      });
    } else {
      res.json({success:false, errors:"Wrong password"});
    }
  } else {
    res.json({success:false, errors: "Wrong email adress"})
  }
})

//cart
app.use("/cart", require("./routes/cartRoute"));

//for shops
app.get('/shop/:shopId', async (req, res) => {
  const shopId = req.params.shopId;

  try {
    const products = await Product.find({ shop_id: shopId });
    console.log(`Products for shop ${shopId} fetched.`);
    res.json(products);
  } catch (err) {
    console.error("Error fetching products by shop:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/get-shop-by-user/:userId', async (req, res) => {
  const { userId } = req.params;
  const shop = await Shop.findOne({ owner_id: userId });
  if (shop) {
      res.json(shop);
  } else {
      res.status(404).json({ error: "Shop not found" });
  }
});

// Creating middlewear to fetch user
// const fetchUser = async (req, res, next) => {
//   const token = req.header('auth-token');
//   if (!token) {
//     res.status(401).send({errors: "Please authenticate using valid login"})
//   } else {
//     try {
//       const data = jwt.verify(token, 'secret_ecom');
//       req.user = data.user;
//       next();
//     } catch (error) {
//       res.status(401).send({errors: "Please authenticate using a valid token"})
//     }
//   }
// }

// app.post('/addtocart', fetchUser, async (req, res) => {
//   console.log(req.body, req.user);
// })