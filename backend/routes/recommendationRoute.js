// routes/recommendRoute.js
const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const session = driver.session();

  try {
    // 1. SAME_CATEGORY
    const sameCategoryResult = await session.run(
      `MATCH (u:User {user_id: $userId})-[:PURCHASED]->(p1:Product)-[:SAME_CATEGORY]->(p2:Product)
       WHERE NOT (u)-[:PURCHASED]->(p2)
       RETURN DISTINCT p2.name AS product`,
      { userId }
    );

    const sameCategory = sameCategoryResult.records.map(r => r.get('product'));

    // 2. BOUGHT_TOGETHER
    const boughtTogetherResult = await session.run(
      `MATCH (u:User {user_id: $userId})-[:PURCHASED]->(p1:Product)-[:BOUGHT_TOGETHER]-(p2:Product)
       WHERE NOT (u)-[:PURCHASED]->(p2)
       RETURN DISTINCT p2.name AS product`,
      { userId }
    );

    const boughtTogether = boughtTogetherResult.records.map(r => r.get('product'));

    // 3. SAME_SHOP
    const sameShopResult = await session.run(
      `MATCH (u:User {user_id: $userId})-[:PURCHASED]->(:Product)<-[:OWNS]-(s:Shop)-[:OWNS]->(p:Product)
       WHERE NOT (u)-[:PURCHASED]->(p)
       RETURN DISTINCT p.name AS product`,
      { userId }
    );

    const sameShop = sameShopResult.records.map(r => r.get('product'));

    // 4. COLLABORATIVE_FILTERING
    const collaborativeResult = await session.run(
      `MATCH (u1:User {user_id: $userId})-[:PURCHASED]->(common:Product)<-[:PURCHASED]-(u2:User)-[:PURCHASED]->(suggested:Product)
       WHERE u1 <> u2 AND NOT (u1)-[:PURCHASED]->(suggested)
       RETURN DISTINCT suggested.name AS product`,
      { userId }
    );

    const collaborative = collaborativeResult.records.map(r => r.get('product'));

    res.json({
      success: true,
      suggestions: {
        sameCategory,
        boughtTogether,
        sameShop,
        collaborative
      }
    });
  } catch (error) {
    console.error("Neo4j query error:", error);
    res.status(500).json({ success: false, error: "Recommendation failed" });
  } finally {
    await session.close();
  }
});


module.exports = router;
