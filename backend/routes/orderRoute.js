const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, getOrdersByUser } = require('../model/order');
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

// 1) ĐẶT HÀNG MỚI
// POST /api/orders
async function createPurchasedRelationships(user_id, productIds) {
    const session = driver.session();
    try {
        for (const product of productIds) {
            await session.run(`
                MATCH  (u:User {user_id: $user_id})
                MATCH  (p:Product {product_id: toString($productId)})
                MERGE (u)-[:PURCHASED]->(p)
            `, { user_id, productId: product.product_id });
        }
    } catch (err) {
        console.error('Neo4j PURCHASED error:', err);
    } finally {
        await session.close();
    }
}
async function createBoughtTogetherRelationships(productIds) {
    const session = driver.session();
    try {
        if (productIds.length > 1) {
            for (let i = 0; i < productIds.length; i++) {
                for (let j = i + 1; j < productIds.length; j++) {
                    const id1 = productIds[i].product_id;
                    const id2 = productIds[j].product_id;

                    if (id1 === id2) continue;

                    await session.run(`
                        MATCH (p1:Product {product_id: toString($id1)})
                        MATCH (p2:Product {product_id: toString($id2)})
                        WHERE NOT (p1)-[:BOUGHT_TOGETHER]-(p2)
                        MERGE (p1)-[:BOUGHT_TOGETHER]->(p2)
                        MERGE (p2)-[:BOUGHT_TOGETHER]->(p1)
                    `, { id1, id2 });
                }
            }
        }
    } catch (err) {
        console.error('Neo4j BOUGHT_TOGETHER error:', err);
    } finally {
        await session.close();
    }
}
async function handleCreateOrderNeo4j(user_id, items) {
    await createPurchasedRelationships(user_id, items);
    await createBoughtTogetherRelationships(items);
}
router.post('/', async (req, res) => {
    try {
        const { user_id, items } = req.body;

        // Validate tối thiểu
        if (!user_id || !items || items.length === 0) {
            return res.status(400).json({ message: 'Thiếu user_id hoặc danh sách sản phẩm' });
        }

        // ✅ Không thêm order_id, session_id ở đây! Để order.js xử lý
        const order_id = await createOrder(req.body);
        await handleCreateOrderNeo4j(user_id, items);

        res.status(201).json({ message: 'Order created', order_id });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 2) XEM LỊCH SỬ ĐƠN HÀNG CỦA USER
// GET /api/orders/user/:userId
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await getOrdersByUser(userId);
        res.json(orders);
    } catch (err) {
        console.error('Error fetching user orders:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 3) XEM CHI TIẾT 1 ĐƠN HÀNG
// GET /api/orders/:orderId
router.get('/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await getOrderById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
