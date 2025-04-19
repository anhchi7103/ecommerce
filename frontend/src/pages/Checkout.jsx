import { useState, useContext } from 'react';

//import CartItems from '../components/CartItems';
import ShippingInfo from '../components/ShippingInfo';
import PaymentMethod from '../components/PaymentMethod';
import OrderSummary from '../components/OrderSummary';
import OrderItems from '../components/OrderItems';
import mockCartItems from '../Data/mockCartItems';

import { ShopContext } from '../Context/ShopContext';

export default function Checkout() {
    const { cartItems, getTotalCartAmount, checkout } = useContext(ShopContext);

    const [info, setInfo] = useState({
        name: '',
        address: '',
        phone: ''
    });

    const [payment, setPayment] = useState('cod');


    const total = getTotalCartAmount();
    const fee = 20000;
    const discount = 10;

    const handleConfirm = async () => {
        try {
            const payload = {
                user_id: 'USER001',
                buyer_name: info.name,
                buyer_phone: info.phone,
                buyer_address: info.address,
                shop_name: 'Shop Demo',
                shipping_carrier: 'GHTK',
                tracking_number: '',
                product_name: Object.values(cartItems).map(i => i.name).join(', '),
                quantity: Object.values(cartItems).reduce((s, i) => s + i.quantity, 0),
                shop_rating: 5,
                item_total: total,
                shipping_fee: fee,
                shipping_discount: 0,
                voucher_discount: 0,
                total_price: total + fee - discount,
                payment_method: payment,

               
            };

            const orderId = await checkout(payload);
            alert('Đơn hàng #' + orderId + ' đã được tạo!');
        } catch (err) {
            console.error(err);
            alert('Không thể tạo đơn hàng');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold">Thanh toán</h1>

            <OrderItems cartItems={mockCartItems} />

            <ShippingInfo
                info={info}
                onChange={e => setInfo({ ...info, [e.target.name]: e.target.value })}
            />

            <PaymentMethod
                selected={payment}
                onChange={e => setPayment(e.target.value)}
            />

            <OrderSummary total={total} fee={fee} discount={discount} />

            <button
                onClick={handleConfirm}
                className="block w-full py-3 bg-black text-white font-semibold rounded"
            >
                Đặt hàng
            </button>
        </div>
    );
}
