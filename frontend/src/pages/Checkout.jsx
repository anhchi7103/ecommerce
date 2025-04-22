/* ===== 📄 Checkout.jsx (Updated to load all fields properly) ===== */

import { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import ShippingInfo from '../components/ShippingInfo';
import PaymentMethod from '../components/PaymentMethod';
import OrderSummary from '../components/OrderSummary';
import OrderItems from '../components/OrderItems';
import axios from 'axios';

export default function Checkout() {
    const { cartItems, all_products, getTotalCartAmount, clearCart } = useContext(ShopContext);

    const [info, setInfo] = useState({
        name: '',
        address_id: '',
        street: '',
        city: '',
        country: '',
        phone: ''
    });

    const [payment, setPayment] = useState('COD');
    const [fee, setFee] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [shopName, setShopName] = useState('');
    const [shopId, setShopId] = useState('');

    const userId = localStorage.getItem('UserID');

    const mergedCartItems = Object.values(cartItems).map((cartItem) => {
        const product = all_products.find(p => String(p._id) === cartItem.productId);
        if (!product) return null;
        return {
            ...product,
            quantity: cartItem.quantity,
            shop_id: product.shop_id || ''
        };
    }).filter(Boolean);

    useEffect(() => {
        // Random fee từ 0.5 USD đến 2.0 USD
        const randomFee = (Math.random() * (2.0 - 0.5) + 0.5).toFixed(2);
        setFee(parseFloat(randomFee));

        // Random discount từ 0 đến 3.0 USD
        const randomDiscount = (Math.random() * 3.0).toFixed(2);
        setDiscount(parseFloat(randomDiscount));
    }, []);


    useEffect(() => {
        if (mergedCartItems.length === 0) return;
        const firstProduct = mergedCartItems[0];
        console.log("firstProduct is:", firstProduct);

        if (!firstProduct?.shop_id) {
            return;
        }

        const fetchShopInfo = async () => {
            try {
                const res = await fetch(`http://localhost:4000/get-shop-by-id/${firstProduct.shop_id}`);
                const data = await res.json();
                if (data.success) {
                    setShopName(data.shop?.shop_name || 'Shop không tên');
                    setShopId(firstProduct.shop_id);
                }
            } catch (err) {
                console.error('Lỗi khi lấy thông tin shop:', err);
                setShopName('Không lấy được tên shop');
            }
        };

        fetchShopInfo();
    }, [mergedCartItems]);

    const handleConfirm = async () => {
        if (!userId) return alert("Bạn chưa đăng nhập!");

        try {
            const items = mergedCartItems.map(item => ({
                product_id: String(item._id),
                product_name: item.name,
                image_url: Array.isArray(item.images) ? item.images[0] : item.images || '',
                quantity: item.quantity,
                item_price: parseFloat(item.price),
                item_amount: parseFloat(item.price) * (item.quantity || 1)
            }));

            const itemsTotal = items.reduce((sum, item) => sum + item.item_amount, 0);
            const shippingFee = fee || 0;
            const discountAmount = discount || 0;
            const totalAmount = itemsTotal + shippingFee - discountAmount;

            const payload = {
                user_id: userId,
                user_name: info.name,
                user_phone: info.phone,

                user_address_id: info.address_id,
                user_address_street: info.street,
                user_address_city: info.city,
                user_address_country: info.country,

                shop_id: shopId,
                shop_name: shopName,

                ship_id: 'ghtk_demo_01',
                ship_unit: 'GHTK',
                ship_tracking_id: 'track123',

                payment_method_id: payment.toLowerCase(),
                payment_method: payment,

                total_amount: totalAmount,
                shipping_fee: shippingFee,
                shipping_discount: discountAmount,
                voucher: 0,

                items
            };

            console.log('Payload gửi:', payload);

            const res = await axios.post('http://localhost:4000/api/orders', payload);
            if (res.status === 201) {
                alert('🎉 Đặt hàng thành công! Mã đơn hàng: ' + res.data.order_id);
                clearCart();
            }
        } catch (err) {
            console.error('Checkout error:', err);
            alert('❌ Không thể tạo đơn hàng!');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold">Thanh toán</h1>

            {shopName && (
                <div className="bg-white p-3 rounded shadow text-sm text-gray-600 italic">
                    🏪 Mua hàng từ: <strong>{shopName}</strong>
                </div>
            )}

            <OrderItems cartItems={mergedCartItems} />
            <ShippingInfo info={info} onChange={e => setInfo({ ...info, [e.target.name]: e.target.value })} />
            <PaymentMethod selected={payment} onChange={e => setPayment(e.target.value)} />
            <OrderSummary total={getTotalCartAmount()} fee={fee} discount={discount} cartItems={mergedCartItems} />

            <button
                onClick={handleConfirm}
                className="block w-full py-3 bg-black text-white font-semibold rounded"
                disabled={mergedCartItems.length === 0}
            >
                Đặt hàng
            </button>
        </div>
    );
}