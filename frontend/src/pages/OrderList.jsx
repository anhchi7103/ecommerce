import  { useState, useEffect } from 'react';
import OrderCard from '../components/Order/OrderCard';
import mockOrders from '../Data/mockOrders';

export default function OrderList() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Sử dụng mock data trong khi chờ API
        setOrders(mockOrders);
    }, []);

    return (
        <div className="p-4 space-y-4 max-w-4xl mx-auto">
            <h1 className="text-xl font-semibold mb-4">Đơn hàng đã mua</h1>
            {orders.length > 0 ? (
                orders.map((order) => <OrderCard key={order.orderId} order={order} />)
            ) : (
                <p>Bạn chưa có đơn hàng nào.</p>
            )}
        </div>
    );
}
