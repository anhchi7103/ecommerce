// src/pages/PurchaseHistory.jsx
import { useState, useEffect } from 'react';
import FilterBar from '../components/PurchaseHistory/FilterBar';
import PurchaseOrderCard from '../components/PurchaseHistory/PurchaseOrderCard';
import { mockPurchaseHistory } from '../data/mockPurchaseHistory';

function mapToFilter(status) {
    if (['Đơn hàng đã đặt', 'Đã xác nhận thông tin thanh toán'].includes(status)) return 'Chờ thanh toán';
    if (status === 'Đã giao cho ĐVVC') return 'Vận chuyển';
    if (status === 'Đã nhận được hàng') return 'Chờ giao hàng';
    if (status === 'Đơn hàng đã hoàn thành') return 'Hoàn thành';
    if (status === 'Đã hủy') return 'Đã hủy';
    if (status === 'Trả hàng/Hoàn tiền') return 'Trả hàng/Hoàn tiền';
    return 'Tất cả';
}

export default function PurchaseHistory() {
    const [filter, setFilter] = useState('Tất cả');
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        setOrders(mockPurchaseHistory);
    }, []);

    const filtered = orders.filter((o) => {
        const cat = mapToFilter(o.status.currentStatus);
        return filter === 'Tất cả' || cat === filter;
    });

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold mb-2">Lịch sử mua hàng</h1>
            <FilterBar selected={filter} onSelect={setFilter} />
            {filtered.length > 0 ? (
                filtered.map((o) => <PurchaseOrderCard key={o.orderId} order={o} />)
            ) : (
                <p className="text-center text-gray-500">Không có đơn hàng phù hợp.</p>
            )}
        </div>
    );
}

PurchaseHistory.propTypes = {};
