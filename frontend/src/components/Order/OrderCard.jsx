// src/components/Order/OrderCard.jsx
import PropTypes from 'prop-types';
import OrderStatusProgress from './OrderStatusProgress';
import OrderShippingInfo from './OrderShippingInfo';
import OrderItemList from './OrderItemList';

export default function OrderCard({ order }) {
    if (!order) return null;
    const { orderId, status, buyer, shipping, items, summary, paymentMethod } = order;

    return (
        <div className="border rounded-xl p-6 shadow-lg bg-white space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    Mã đơn: <span className="font-semibold text-gray-800">{orderId}</span>
                </span>
                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {status.currentStatus}
                </span>
            </div>

            {/* Status Progress lên trên */}
            <OrderStatusProgress history={status.history} />

            {/* Buyer & Shipping */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 text-sm space-y-1">
                    <h3 className="font-semibold text-gray-800">Người nhận</h3>
                    <div><strong>Tên:</strong> {buyer.name}</div>
                    <div><strong>Điện thoại:</strong> {buyer.phone}</div>
                    <div><strong>Địa chỉ:</strong> {buyer.address}</div>
                </div>
                <div className="flex-1 text-sm">
                    <OrderShippingInfo shipping={shipping} />
                </div>
            </div>

            {/* Product List */}
            <OrderItemList items={items} />

            {/* Payment Summary */}
            <div className="w-full lg:w-1/2 lg:ml-auto border-t pt-4 text-sm space-y-2">
                <div className="flex justify-between"><span className="text-gray-600">Tổng tiền hàng:</span><span>{summary.itemsTotal.toLocaleString()} đ</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Phí vận chuyển:</span><span>{summary.shippingFee.toLocaleString()} đ</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Giảm giá vận chuyển:</span><span>-{summary.shippingDiscount.toLocaleString()} đ</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Voucher:</span><span>-{summary.voucherDiscount.toLocaleString()} đ</span></div>
                <div className="flex justify-between font-bold text-lg text-red-600 pt-2 border-t mt-2"><span>Thành tiền:</span><span>{summary.total.toLocaleString()} đ</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Thanh toán:</span><span>{paymentMethod}</span></div>
            </div>
        </div>
    );
}

OrderCard.propTypes = {
    order: PropTypes.shape({
        orderId: PropTypes.string.isRequired,
        status: PropTypes.shape({
            currentStatus: PropTypes.string.isRequired,
            history: PropTypes.array.isRequired,
        }).isRequired,
        buyer: PropTypes.object.isRequired,
        shipping: PropTypes.object.isRequired,
        items: PropTypes.array.isRequired,
        summary: PropTypes.object.isRequired,
        paymentMethod: PropTypes.string.isRequired,
    }).isRequired,
};
