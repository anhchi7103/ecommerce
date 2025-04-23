import { useState, useEffect } from 'react';
import axios from 'axios';
import FilterBar from '../components/PurchaseHistory/FilterBar';
import PurchaseOrderCard from '../components/PurchaseHistory/PurchaseOrderCard';

// 👉 Ánh xạ trạng thái từ đơn hàng thực tế sang bộ lọc
/*function mapToFilter(status, paymentMethod) {
    if (['Order Placed', 'Payment Confirmed'].includes(status)) {
        return paymentMethod === 'paypal' ? 'Pending Payment' : 'All';
    }
    if (status === 'Shipped to Carrier') return 'Shipping';
    if (status === 'Delivered') return 'Awaiting Delivery';
    if (status === 'Order Completed') return 'Completed';
    if (status === 'Cancelled') return 'Cancelled';
    if (status === 'Return/Refund') return 'Return/Refund';
    return 'All';
}*/


export default function PurchaseHistory() {
    const [filter, setFilter] = useState('All');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const userId = localStorage.getItem('UserID');
                if (!userId) return;

                // ✅ Dùng URL tuyệt đối nếu frontend và backend KHÁC PORT
                const response = await axios.get(`http://localhost:4000/api/orders/user/${userId}`);

                const data = response.data;
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    console.warn("⚠️ Dữ liệu trả về không phải mảng:", data);
                    setOrders([]);
                }
            } catch (err) {
                console.error('❌ Lỗi khi lấy đơn hàng:', err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

    /*const filtered = Array.isArray(orders)
        ? orders.filter((o) => {
            const cat = mapToFilter(o.status?.currentStatus || '', o.paymentMethod || '');
            return filter === 'All' || cat === filter;
        })
        : [];*/
    const filtered = Array.isArray(orders)
        ? orders.filter((o) => {
            if (filter === 'All') return true;
            // Nếu muốn lọc theo trạng thái cụ thể, bạn có thể mở logic này sau
            return false; // hiện tại chỉ hiển thị ở "All"
        })
        : [];



    return (
        <div className="max-w-5xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold mb-2">Purchase history</h1>
            <FilterBar selected={filter} onSelect={setFilter} />

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : filtered.length > 0 ? (
                filtered.map((o) => <PurchaseOrderCard key={o.orderId} order={o} />)
            ) : (
                <p className="text-center text-gray-500">No matching orders found.</p>
            )}
        </div>
    );
}
