import { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import ShippingInfo from '../components/ShippingInfo';
import PaymentMethod from '../components/PaymentMethod';
import OrderSummary from '../components/OrderSummary';
import OrderItems from '../components/OrderItems';
import axios from 'axios';

export default function Checkout() {
    const { cartItems, all_products, getTotalCartAmount, clearCart } = useContext(ShopContext);

    const [info, setInfo] = useState({ name: '', address: '', phone: '' });
    const [payment, setPayment] = useState('COD');
    const [fee, setFee] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [shopName, setShopName] = useState('');
    const [shopId, setShopId] = useState('');

    const userId = localStorage.getItem('UserID');
    const total = getTotalCartAmount();

    const mergedCartItems = Object.values(cartItems).map((cartItem) => {
        const product = all_products.find(p => String(p._id) === cartItem.productId);
        if (!product) return null;
        return { ...product, quantity: cartItem.quantity };
    }).filter(Boolean);

    useEffect(() => {
        setFee(Math.floor(Math.random() * 25000 + 15000));      // 15,000 – 40,000 VND
        setDiscount(Math.floor(Math.random() * 50000));         // 0 – 50,000 VND
    }, []);

    useEffect(() => {
        const firstProduct = mergedCartItems[0];
        if (!firstProduct?.shop_id) return;

        const fetchShopInfo = async () => {
            try {
                const res = await fetch(`http://localhost:4000/shop/${firstProduct.shop_id}`);
                const data = await res.json();
                if (data.success) {
                    setShopName(data.shop?.name || 'Shop không tên');
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
                product_id: item._id,
                product_name: item.name,
                image_url: item.images,
                quantity: item.quantity,
                item_price: item.price,
                item_amount: item.price * item.quantity
            }));

            const payload = {
                user_id: userId,
                user_name: info.name,
                user_phone: info.phone,
                user_address_id: info.address,

                shop_id: shopId,
                shop_name: shopName,

                ship_id: 'ghtk_demo_01',
                ship_unit: 'GHTK',
                ship_tracking_id: '',

                payment_method_id: payment.toLowerCase(), // e.g. 'cod', 'paypal'
                payment_method: payment,

                total_amount: total,
                shipping_fee: fee,
                shipping_discount: 0,
                voucher: discount,

                items
            };
            console.log(payload);
            const res = await axios.post('http://localhost:4000/api/orders', payload);
            if (res.status === 201) {
                alert('🎉 Đặt hàng thành công! Mã đơn hàng: ' + res.data.order_id);
                clearCart(); // Clear cart after success
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

            <ShippingInfo
                info={info}
                onChange={e => setInfo({ ...info, [e.target.name]: e.target.value })}
            />

            <PaymentMethod
                selected={payment}
                onChange={e => setPayment(e.target.value)}
            />

            <OrderSummary total={total} fee={fee} discount={discount} cartItems={mergedCartItems} />

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
