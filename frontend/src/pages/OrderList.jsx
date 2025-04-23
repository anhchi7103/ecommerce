// src/pages/OrderList.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import OrderCard from '../components/Order/OrderCard';

export default function OrderList() {
    const { orderId } = useParams(); // 👈 lấy orderId từ URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const response = await axios.get(`/api/orders/${orderId}`);
                console.log('Order data:', response.data);

                setOrder(response.data);
            } catch (error) {
                console.error('❌ Lỗi khi lấy chi tiết đơn hàng:', error);
            } finally {
                setLoading(false);
            }
        }

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    return (
        <div className="p-4 space-y-4 max-w-4xl mx-auto">
            <h1 className="text-xl font-semibold mb-4">Order details</h1>
            {loading ? (
                <p>Loading...</p>
            ) : order ? (
                <OrderCard order={order} />
            ) : (
                <p>Order not found.</p>
            )}
        </div>
    );
}
