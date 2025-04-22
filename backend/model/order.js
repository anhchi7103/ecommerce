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
    const current_status = 'Đơn hàng đã đặt';

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

    // ✅ Insert vào ecommerce.orders_by_user
    const query3 = `
        INSERT INTO ecommerce.orders_by_user (
            user_id, session_time, order_id, current_status,
            shop_id, shop_name, total_amount
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await astraClient.execute(query3, [
        user_id, created_at, order_id, current_status,
        shop_id, shop_name, parseFloat(total_amount) || 0
    ], { prepare: true });

    return order_id;
}

module.exports = { createOrder };