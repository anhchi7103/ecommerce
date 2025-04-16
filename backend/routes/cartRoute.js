
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

        res.status(200).json({ message: "Added to cart" });

    } catch (err) {
        console.error("Error adding to cart:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /cart/:userId - Get user's cart
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // get all product entries in the cart hash
        const cart = await redisClient.hGetAll(`cart:${userId}`);

        // convert the values from JSON strings to real objects
        const parsedCart = Object.entries(cart).map(([key, value]) => {
            return JSON.parse(value);
        });

        res.status(200).json({
            success: true,
            cart: parsedCart,
        });

    } catch (err) {
        console.error('Error getting cart:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve cart',
        });
    }
});

router.post("/delete", async (req, res) => {
    const { userId, productId } = req.body;
  
    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: "Missing userId or productId" });
    }
  
    const cartKey = `cart:${userId}`;
    const fieldKey = `product_${productId}`;
  
    try {
      const productData = await redisClient.hGet(cartKey, fieldKey);
  
      if (!productData) {
        return res.status(404).json({ success: false, message: "Product not found in cart" });
      }
  
      const parsedData = JSON.parse(productData);
      parsedData.quantity -= 1;
  
      if (parsedData.quantity <= 0) {
        await redisClient.hDel(cartKey, fieldKey);
        return res.json({ success: true, message: "Product removed from cart" });
      } else {
        await redisClient.hSet(cartKey, fieldKey, JSON.stringify(parsedData));
        return res.json({ success: true, message: "Product quantity decreased", updated: parsedData });
      }
  
    } catch (err) {
      console.error("Error updating cart:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

module.exports = router;
