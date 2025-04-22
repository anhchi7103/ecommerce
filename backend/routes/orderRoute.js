const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, getOrdersByUser } = require('../model/order');

// 1) ĐẶT HÀNG MỚI
// POST /api/orders
router.post('/', async (req, res) => {
    try {
        const { user_id, items } = req.body;

        // Validate tối thiểu
        if (!user_id || !items || items.length === 0) {
            return res.status(400).json({ message: 'Thiếu user_id hoặc danh sách sản phẩm' });
        }

        // ✅ Không thêm order_id, session_id ở đây! Để order.js xử lý
        const order_id = await createOrder(req.body);

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
