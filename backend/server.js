const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const neo4j = require("neo4j-driver");
const { error } = require("console");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import Models
const Product = require("./model/product");
const User = require("./model/user");
const Shop = require("./model/shop");


// Connect Cassandra (Astra DB)
const astraClient = require("./middleware/cassandra");
astraClient.connect()
    .then(() => console.log("✅ Connected to Astra DB"))
    .catch((error) => console.error("❌ Astra DB connection error:", error));

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((error) => console.error('❌ MongoDB connection error:', error));

// Connect Redis
const redisClient = require("./middleware/dbConfig");

// Connect Neo4j
const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USER = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));
const session = driver.session();

async function testConnection() {
    try {
        const result = await session.run('RETURN "✅ Connected to Aura (Neo4j)!" AS message');
        console.log(result.records[0].get('message'));
    } catch (error) {
        console.error('❌ Neo4j connection error:', error);
    } finally {
        await session.close();
        await driver.close();
    }
}
testConnection();

// Routes
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Orders (Cassandra)
const orderRoute = require("./routes/orderRoute");
app.use("/api/orders", orderRoute);

// Cart (MongoDB / Redis)
app.use("/cart", require("./routes/cartRoute"));

// Redis Cache Test
app.get('/cache-test', async (req, res) => {
    try {
        await redisClient.set('message', 'Hello from Redis!', { EX: 60 });
        const value = await redisClient.get('message');
        res.send(value);
    } catch (err) {
        console.error('Redis error:', err);
        res.status(500).send('Something went wrong');
    }
});

// Image upload (multer)
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });
app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${PORT}/images/${req.file.filename}`
    });
});

// Product Management (MongoDB)
app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id = products.length > 0 ? Number(products.slice(-1)[0]._id) + 1 : 1;

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
    });

    await product.save();
    res.json({ success: true, name: req.body.name });
});

app.post('/deleteproduct', async (req, res) => {
    await Product.findOneAndDelete({ _id: req.body._id });
    res.json({ success: true });
});

app.get('/get-allproducts', async (req, res) => {
    const products = await Product.find({});
    res.send(products);
});

// User Authentication (MongoDB)
app.post('/signup', async (req, res) => {
    try {
        const { email, username, first_name, last_name, phone_number, password_hash } = req.body;
        if (!email || !username || !password_hash || !first_name || !last_name || !phone_number) {
            return res.status(400).json({ success: false, errors: "All fields are required" });
        }

        let check = await User.findOne({ email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing user found with same email address" });
        }

        const user = new User({
            username,
            email,
            password_hash,
            first_name,
            last_name,
            phone_number,
            address: req.body.address || [],
            payment_methods: req.body.payment_methods || [],
            wishlist: req.body.wishlist || [],
            rank: req.body.rank || 'regular'
        });

        await user.save();
        res.status(201).json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user && req.body.password_hash === user.password_hash) {
        res.json({ success: true, userId: user._id });
    } else {
        res.json({ success: false, errors: "Wrong email address or password" });
    }
});

app.get('/user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// Shops (MongoDB)
app.get('/shop/:shopId', async (req, res) => {
    try {
        const products = await Product.find({ shop_id: req.params.shopId });
        res.json(products);
    } catch (err) {
        console.error("Error fetching products by shop:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/get-shop-by-user/:userId', async (req, res) => {
    const shop = await Shop.findOne({ owner_id: req.params.userId });
    if (shop) {
        res.json(shop);
    } else {
        res.status(404).json({ error: "Shop not found" });
    }
});

app.get('/get-shop-by-id/:shopId', async (req, res) => {
    const shop = await Shop.findById(req.params.shopId); 
    res.json(shop);
  });

app.post('/register-shop/:userId', async (req, res) => {
    try {
        // Kiểm tra user có tồn tại không
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Lấy danh sách shop để tạo id mới
        // const shops = await Shop.find({});
        // // const id = shops.length > 0
        // //     ? `${Number(shops.slice(-1)[0]._id.split('_')[1]) + 1}`
        // //     : "1";

        // Tạo shop mới
        const shop = new Shop({
            // _id: id,
            owner_id: user._id,  // chỉ lấy ID
            shop_name: req.body.shop_name,
            description: req.body.description,
            rating: 0
        });

        await shop.save();
        res.status(201).json({ success: true, shop_name: shop.shop_name });

    } catch (err) {
        console.error("Error registering shop:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

// Final Server Listen
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
