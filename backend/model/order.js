const { astraClient } = require('../middleware/cassandra');
const User = require('../model/user');
const redisClient = require('../middleware/dbConfig');
const { v4: uuidv4 } = require('uuid');

async function createOrder(data) {
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
    } = data;

    if (!user_id || !items || items.length === 0) {
        throw new Error('Missing user_id or items in order');
    }

    const order_id = uuidv4();
    const session_id = uuidv4();
    const created_at = new Date();
    const current_status = 'Đơn hàng đã đặt';

    // ✅ 1. Insert into ecommerce.orders
    const query1 = `
        INSERT INTO ecommerce.orders (
            order_id, session_id,
            user_id, user_name, user_phone, user_address_id,
            shop_id, shop_name,
            ship_id, ship_unit, ship_tracking_id,
            payment_method_id, payment_method,
            total_amount, shipping_fee, shipping_discount, voucher,
            created_at, items
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params1 = [
        order_id, session_id,
        user_id, user_name, user_phone, user_address_id,
        shop_id, shop_name,
        ship_id, ship_unit, ship_tracking_id,
        payment_method_id, payment_method,
        total_amount, shipping_fee, shipping_discount, voucher,
        created_at, items
    ];

    await astraClient.execute(query1, params1, { prepare: true });

    // ✅ 2. Insert into ecommerce.order_status
    const query2 = `
        INSERT INTO ecommerce.order_status (order_id, event_time, status)
        VALUES (?, ?, ?)
    `;

    const params2 = [order_id, created_at, current_status];

    await astraClient.execute(query2, params2, { prepare: true });

    // ✅ 3. Insert into ecommerce.orders_by_user
    const query3 = `
        INSERT INTO ecommerce.orders_by_user (
            user_id, session_time, order_id, current_status,
            shop_id, shop_name, total_amount
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params3 = [
        user_id,
        created_at,
        order_id,
        current_status,
        shop_id,
        shop_name,
        total_amount
    ];

    await astraClient.execute(query3, params3, { prepare: true });

    return order_id;
}

// 1) Create Order by fetching from MongoDB (User) and Redis (Cart)
async function createOrderFromCart(userId, payment_method) {
    // Step 1: Fetch user info
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Step 2: Fetch cart info
    const cartKey = `cart:${userId}`;
    const cartItemsRaw = await redisClient.hGetAll(cartKey);
    const cartItems = Object.values(cartItemsRaw).map(item => JSON.parse(item));

    if (cartItems.length === 0) {
        throw new Error('Cart is empty');
    }

    // Step 3: Prepare data for inserting into Cassandra
    const order_id = uuidv4();
    const session_id = uuidv4();
    const created_at = new Date();
    const total_amount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const items = cartItems.map(item => ({
        product_id: item.productId,
        product_name: item.name,
        image_url: item.images?.[0] || '',
        quantity: item.quantity,
        item_price: item.price,
        item_amount: item.price * item.quantity
    }));

    // Step 4: Insert into ecommerce.orders
    const query1 = `
        INSERT INTO ecommerce.orders (
            order_id, session_id, user_id, user_name, user_phone, user_address_id,
            shop_id, shop_name,
            ship_id, ship_unit, ship_tracking_id,
            payment_method_id, payment_method,
            total_amount, shipping_fee, shipping_discount, voucher,
            created_at, items
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params1 = [
        order_id,
        session_id,
        user._id.toString(),
        user.first_name + ' ' + user.last_name,
        user.phone_number,
        (user.address && user.address.length > 0) ? user.address[0]._id || '' : '',
        '', '', '', '', '', '', // ship_id, ship_unit, ship_tracking_id
        '', payment_method || 'COD', // payment_method_id, payment_method
        total_amount,
        0, 0, 0, // shipping_fee, shipping_discount, voucher
        created_at,
        items
    ];

    await astraClient.execute(query1, params1, { prepare: true });

    // Step 5: Insert into ecommerce.order_status
    const query2 = `
        INSERT INTO ecommerce.order_status (order_id, event_time, status)
        VALUES (?, ?, ?)
    `;
    const params2 = [order_id, created_at, 'Đơn hàng đã đặt'];

    await astraClient.execute(query2, params2, { prepare: true });

    // Step 6: Insert into ecommerce.orders_by_user
    const query3 = `
        INSERT INTO ecommerce.orders_by_user (
            user_id, session_time, order_id, current_status,
            shop_id, shop_name, total_amount
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params3 = [
        user._id.toString(),
        created_at,
        order_id,
        'Đơn hàng đã đặt',
        '', '', // shop_id, shop_name (You can update later if needed)
        total_amount
    ];

    await astraClient.execute(query3, params3, { prepare: true });

    // Step 7: Clean up cart (optional)
    await redisClient.del(cartKey);

    return order_id;
}

// 2) Fetch user's order history
async function getOrdersByUser(userId) {
    const query = 'SELECT * FROM ecommerce.orders_by_user WHERE user_id = ?';
    const result = await astraClient.execute(query, [userId], { prepare: true });
    return result.rows;
}

// 3) Fetch order details
async function getOrderById(orderId) {
    const orderQuery = 'SELECT * FROM ecommerce.orders WHERE order_id = ?';
    const statusQuery = 'SELECT * FROM ecommerce.order_status WHERE order_id = ?';

    const [orderResult, statusResult] = await Promise.all([
        astraClient.execute(orderQuery, [orderId], { prepare: true }),
        astraClient.execute(statusQuery, [orderId], { prepare: true })
    ]);

    const order = orderResult.rows[0];
    const statuses = statusResult.rows;

    if (!order) {
        return null;
    }

    return {
        ...order,
        statuses: statuses.map(s => ({
            status: s.status,
            event_time: s.event_time
        }))
    };
}

module.exports = { createOrder, createOrderFromCart, getOrderById, getOrdersByUser };
