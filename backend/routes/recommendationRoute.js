const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (u1:User {user_id: $userId})-[:PURCHASED]->(common:Product)<-[:PURCHASED]-(u2:User)-[:PURCHASED]->(suggested:Product)
       WHERE u1 <> u2 AND NOT (u1)-[:PURCHASED]->(suggested)
       RETURN DISTINCT suggested.name AS product, suggested.product_id AS productId`,
      { userId }
    );

    const collaborative = result.records.map(r => ({
      _id: r.get('productId'),
      name: r.get('product'),
    }));
    

    res.json({
      success: true,
      source: 'user-based',
      suggestions: { collaborative }
    });
  } catch (error) {
    console.error("User recommendation error:", error);
    res.status(500).json({ success: false, error: "User recommendation failed" });
  } finally {
    await session.close();
  }
});

router.get('/product/:productId', async (req, res) => {
  const productId = req.params.productId;
  const session = driver.session();

  try {
    // 1. SAME_CATEGORY
    const sameCategoryResult = await session.run(
      `MATCH (p1:Product {product_id: $productId })-[:SAME_CATEGORY]-(p2:Product)
       RETURN DISTINCT p2.name AS product, p2.product_id AS productId`,
      { productId }
    );
    const sameCategory = sameCategoryResult.records.map(r => ({
      _id: r.get('productId'),
      name: r.get('product'),
    }));

    // 2. BOUGHT_TOGETHER
    const boughtTogetherResult = await session.run(
      `MATCH (p1:Product {product_id: $productId})-[:BOUGHT_TOGETHER]-(p2:Product)
       RETURN DISTINCT p2.name AS product, p2.product_id AS productId`,
      { productId }
    );
    const boughtTogether = boughtTogetherResult.records.map(r => ({
      _id: r.get('productId'),
      name: r.get('product'),
    }));

    // 3. SAME_SHOP
    const sameShopResult = await session.run(
      `MATCH (p1:Product {product_id: $productId})<-[:OWNS]-(s:Shop)-[:OWNS]-(p2:Product)
       WHERE p1 <> p2
       RETURN DISTINCT p2.name AS product, p2.product_id AS productId` ,
      { productId }
    );
    const sameShop = sameShopResult.records.map(r => ({
      _id: r.get('productId'),
      name: r.get('product'),
    }));

    res.json({
      success: true,
      source: 'product-based',
      suggestions: {
        sameCategory,
        boughtTogether,
        sameShop
      }
    });
  } catch (error) {
    console.error("Product recommendation error:", error);
    res.status(500).json({ success: false, error: "Product recommendation failed" });
  } finally {
    await session.close();
  }
});

module.exports = router;
