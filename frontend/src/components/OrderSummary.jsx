import PropTypes from 'prop-types';

export default function OrderSummary({ total, fee, discount }) {
    const totalAmount = total + fee - discount;

    return (
        <section className="my-6 p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Tóm tắt đơn hàng</h3>

            {/* Hiển thị tổng tiền hàng */}
            <div className="flex justify-between mb-1">
                <span>Tổng tiền hàng:</span>
                <span className="font-medium">{total.toLocaleString()} ₫</span>
            </div>

            {/* Hiển thị tổng tiền phí vận chuyển */}
            <div className="flex justify-between mb-1">
                <span>Tổng tiền phí vận chuyển:</span>
                <span className="font-medium">{fee.toLocaleString()} ₫</span>
            </div>

            {/* Hiển thị giảm giá từ voucher (nếu có) */}
            {discount > 0 && (
                <div className="flex justify-between mb-1 text-green-600">
                    <span>Tổng cộng Voucher giảm giá:</span>
                    <span>-{discount.toLocaleString()} ₫</span>
                </div>
            )}

            {/* Đường kẻ ngăn cách */}
            <hr className="my-2" />

            {/* Hiển thị tổng thanh toán */}
            <div className="flex justify-between text-xl font-bold">
                <span>Tổng thanh toán:</span>
                <span>{totalAmount.toLocaleString()} ₫</span>
            </div>
        </section>
    );
}

OrderSummary.propTypes = {
    total: PropTypes.number.isRequired,       // Tổng tiền hàng
    fee: PropTypes.number.isRequired,         // Phí vận chuyển
    discount: PropTypes.number.isRequired,    // Giảm giá (nếu có)
};
