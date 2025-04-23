/* ===== 📄 order.js (Fix full chuẩn với Cassandra Schema mới) ===== */

const astraClient = require('../middleware/cassandra');
const User = require('../model/user');
const Shop = require('../model/shop');
const { v4: uuidv4 } = require('uuid');

async function createOrder(data) {
    let {
        user_id,
        user_name,
        user_phone,
        user_address_id,
        user_address_street,
        user_address_city,
        user_address_country,

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
    const current_status = 'Order Placed';

    // ✅ Lấy thiếu thông tin user => tự động lấy từ MongoDB
    if (!user_name || !user_phone || !user_address_street || !user_address_city || !user_address_country) {
        const user = await User.findById(user_id).lean();
        if (user) {
            user_name = `${user.first_name} ${user.last_name}`;
            user_phone = user.phone_number;

            if (user.address && user.address.length > 0) {
                user_address_id = user.address[0].address_id || '';
                user_address_street = user.address[0].street || '';
                user_address_city = user.address[0].city || '';
                user_address_country = user.address[0].country || '';
            }
        }
    }

    // ✅ Lấy thiếu thông tin shop => tự động lấy từ MongoDB
    if (!shop_name && shop_id) {
        const shop = await Shop.findById(shop_id).lean();
        if (shop) {
            shop_name = shop.shop_name;
        }
    }

    // ✅ Format items list đúng chuẩn Cassandra list<frozen<item>>
    const formattedItems = items.map(item => ({
        product_id: String(item.product_id),
        product_name: item.product_name,
        image_url: item.image_url,
        quantity: item.quantity,
        item_price: item.item_price,
        item_amount: item.item_amount
    }));

    // ✅ Query Insert vào ecommerce.orders (full chuẩn 23 cột)
    const query1 = `
       INSERT INTO ecommerce.orders (
         order_id, session_id,
         user_id, user_name, user_phone,
         user_address_id, user_address_street, user_address_city, user_address_country,
         shop_id, shop_name,
         ship_id, ship_unit, ship_tracking_id,
         payment_method_id, payment_method,
         total_amount, shipping_fee, shipping_discount, voucher,
         created_at, items
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params1 = [
        order_id, session_id,
        user_id, user_name, user_phone,
        user_address_id, user_address_street, user_address_city, user_address_country,
        shop_id, shop_name,
        ship_id, ship_unit, ship_tracking_id,
        payment_method_id, payment_method,
        parseFloat(total_amount) || 0,
        parseFloat(shipping_fee) || 0,
        parseFloat(shipping_discount) || 0,
        parseFloat(voucher) || 0,
        created_at,
        formattedItems
    ];

    await astraClient.execute(query1, params1, { prepare: true });

    // ✅ Insert vào ecommerce.order_status
    const query2 = `
        INSERT INTO ecommerce.order_status (
            order_id, event_time, status
        ) VALUES (?, ?, ?)
    `;

    await astraClient.execute(query2, [order_id, created_at, current_status], { prepare: true });

    /*// ✅ Insert vào ecommerce.orders_by_user
    const query3 = `
        INSERT INTO ecommerce.orders_by_user (
            user_id, session_time, order_id, current_status,
            shop_id, shop_name, total_amount
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await astraClient.execute(query3, [
        user_id, created_at, order_id, current_status,
        shop_id, shop_name, parseFloat(total_amount) || 0
    ], { prepare: true });*/

    return order_id;
}



// Lấy danh sách đơn hàng theo user
// ⚠️ Cassandra không cho phép filter user_id nếu không là primary key
// → Giả sử đã có secondary index (hoặc dùng materialized view)
async function getOrdersByUser(userId) {
    const queryOrders = `
        SELECT * FROM ecommerce.orders WHERE user_id = ? ALLOW FILTERING
    `;

    const result = await astraClient.execute(queryOrders, [userId], { prepare: true });

    const orders = result.rows;

    const fullOrders = await Promise.all(
        orders.map(async (order) => {
            // Lấy trạng thái mới nhất từ order_status
            const statusQuery = `
                SELECT status FROM ecommerce.order_status
                WHERE order_id = ?
                ORDER BY event_time DESC
                LIMIT 1
            `;

            const statusResult = await astraClient.execute(statusQuery, [order.order_id], { prepare: true });
            const latestStatus = statusResult?.rows?.[0]?.status || 'Unknown';

            return {
                orderId: order.order_id,
                shop: {
                    id: order.shop_id,
                    name: order.shop_name || 'Unknown'
                },
                status: {
                    currentStatus: latestStatus
                },
                summary: {
                    total: parseFloat(order.total_amount || 0)
                },
                items: order.items || [],
                createdAt: order.created_at
            };
        })
    );

    return fullOrders;
}

// Lấy thông tin chi tiết một đơn hàng theo orderId
async function getOrderById(orderId) {
    try {
        console.log('📥 [getOrderById] Nhận orderId:', orderId);

        const query1 = `SELECT * FROM ecommerce.orders WHERE order_id = ?`;
        const result1 = await astraClient.execute(query1, [orderId], { prepare: true });

        if (!result1.rows || result1.rows.length === 0) {
            console.warn('⚠️ Không tìm thấy đơn hàng');
            return null;
        }

        const order = result1.rows[0];
        console.log('✅ Đơn hàng:', order);

        const query2 = `
            SELECT status, event_time FROM ecommerce.order_status
            WHERE order_id = ?
            ORDER BY event_time ASC
        `;
        const result2 = await astraClient.execute(query2, [orderId], { prepare: true });
        console.log('✅ Lịch sử trạng thái:', result2.rows);

        const history = result2.rows.map(row => ({
            status: row.status,
            time: row.event_time?.toISOString().slice(0, 16).replace('T', ' ') || ''
        }));

        return {
            orderId: order.order_id,
            status: {
                currentStatus: history[history.length - 1]?.status || 'Unknown',
                history
            },
            buyer: {
                name: order.user_name,
                phone: order.user_phone,
                address: `${order.user_address_street}, ${order.user_address_city}, ${order.user_address_country}`
            },
            shipping: {
                provider: order.ship_unit,
                trackingNumber: order.ship_tracking_id
            },
            shop: {
                id: order.shop_id,
                name: order.shop_name || 'Unknown'
            },

            items: (order.items || []).map(item => ({
                ...item,
                item_price: parseFloat(item.item_price || 0),
                item_amount: parseFloat(item.item_amount || 0),
            })),
            summary: {
                itemsTotal: parseFloat(order.total_amount || 0),
                shippingFee: parseFloat(order.shipping_fee || 0),
                shippingDiscount: parseFloat(order.shipping_discount || 0),
                voucherDiscount: parseFloat(order.voucher || 0),
                total: parseFloat(order.total_amount || 0)
            },
            paymentMethod: order.payment_method
        };
    } catch (err) {
        console.error('❌ [getOrderById] Lỗi:', err);
        throw err;
    }
}


module.exports = {
    createOrder,
    getOrdersByUser,
    getOrderById
};



