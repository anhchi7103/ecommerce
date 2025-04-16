
const express = require("express");
const router = express.Router();
const Product = require("../model/product"); 
const redisClient = require("../model/dbConfig"); 

// POST /cart/add
router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const item = {
      productId: product._id.toString(),
      quantity
    };

    await redisClient.hSet(`cart:${userId}`, `product_${product._id}`, JSON.stringify(item));

    // Optional: reset expiry every time they add something
     await redisClient.expire(`cart:${userId}`, 60 * 60 * 24); // 24h

    res.status(200).json({ message: "Added to cart" });

  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
