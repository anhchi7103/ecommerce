const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, getOrdersByUser } = require('../model/order');
const { v4: uuidv4 } = require('uuid');

// 1) ĐẶT HÀNG MỚI
// POST /api/orders
router.post('/', async (req, res) => {
    try {
        const {
            user_id,
            user_name,
            user_phone,
            user_address_id,

            shop_id,
            shop_name,

            ship_id,
            ship_unit,
            ship_tracking_id,

            payment_method_id,
            payment_method,

            total_amount,
            shipping_fee,
            shipping_discount,
            voucher,

            items
        } = req.body;

        // Validate tối thiểu
        if (!user_id || !items || items.length === 0) {
            return res.status(400).json({ message: 'Thiếu user_id hoặc danh sách sản phẩm' });
        }

        const orderData = {
            order_id: uuidv4(),
            session_id: uuidv4(),

            user_id,
            user_name,
            user_phone,
            user_address_id,

            shop_id,
            shop_name,

            ship_id,
            ship_unit,
            ship_tracking_id,

            payment_method_id,
            payment_method,

            total_amount,
            shipping_fee,
            shipping_discount,
            voucher,

            created_at: new Date(),
            items
        };

        // Call createOrder function from model
        const order_id = await createOrder(orderData);

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

        // Call getOrdersByUser function from model
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

        // Call getOrderById function from model
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
