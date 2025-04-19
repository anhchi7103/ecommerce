// src/components/PurchaseHistory/PurchaseOrderCard.jsx
//import React from 'react';
import PropTypes from 'prop-types';
import OrderItemList from '../Order/OrderItemList';

export default function PurchaseOrderCard({ order }) {
    const { shop, orderId, status, items, summary } = order;
    return (
        <div className="border rounded-lg p-6 bg-white shadow-md space-y-4 min-w-full">
            <div className="flex justify-between items-center">
                <div className="font-semibold text-lg">{shop.name}</div>
                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-full">{status.currentStatus}</span>
            </div>
            <OrderItemList items={items} />
            <div className="flex justify-end text-base font-semibold">
                Thành tiền: {summary.total.toLocaleString()} đ
            </div>
        </div>
    );
}

PurchaseOrderCard.propTypes = {
    order: PropTypes.shape({
        shop: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
        orderId: PropTypes.string.isRequired,
        status: PropTypes.shape({ currentStatus: PropTypes.string.isRequired }).isRequired,
        items: PropTypes.array.isRequired,
        summary: PropTypes.shape({ total: PropTypes.number.isRequired }).isRequired,
    }).isRequired,
};