// backend/model/order.js
const { cassandraClient } = require('./dbConfig');
const { v4: uuidv4 } = require('uuid');

async function createOrder(data) {
    const order_id = uuidv4();
    const now = new Date();
    const statuses = ['Đơn hàng đã đặt'];
    const times = [now];

    const {
        user_id, buyer_name, buyer_phone, buyer_address,
        shop_name, shipping_carrier, tracking_number,
        product_name, quantity, shop_rating,
        item_total, shipping_fee, shipping_discount,
        voucher_discount, total_price, payment_method
    } = data;

    const query = `INSERT INTO orders (order_id, user_id, statuses, times, buyer_name, buyer_phone, buyer_address, shop_name, shipping_carrier, tracking_number, product_name, quantity, shop_rating, item_total, shipping_fee, shipping_discount, voucher_discount, total_price, payment_method) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
        order_id, user_id,
        statuses, times,
        buyer_name, buyer_phone, buyer_address,
        shop_name, shipping_carrier, tracking_number,
        product_name, quantity, shop_rating,
        item_total, shipping_fee, shipping_discount,
        voucher_discount, total_price, payment_method
    ];

    await cassandraClient.execute(query, params, { prepare: true });
    return order_id;
}

async function getOrdersByUser(userId) {
    const query = 'SELECT * FROM orders_by_user WHERE user_id = ?';
    const result = await cassandraClient.execute(query, [userId], { prepare: true });
    return result.rows;
}

async function getOrderById(orderId) {
    const query = 'SELECT * FROM orders WHERE order_id = ?';
    const result = await cassandraClient.execute(query, [orderId], { prepare: true });
    return result.rows[0] || null;
}

module.exports = { createOrder, getOrderById, getOrdersByUser };
