import PropTypes from 'prop-types';

const OrderSummary = ({ cartItems }) => {
    if (!cartItems || cartItems.length === 0) return null;

    const subtotal = cartItems.reduce((total, item) => {
        const itemPrice = item.price || 0;
        const quantity = item.quantity || 0;
        return total + itemPrice * quantity;
    }, 0);

    // Mock values — you can replace these with dynamic props/state later
    const shippingFee = 25;
    const discount = 15;

    const grandTotal = subtotal + shippingFee - discount;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full mt-6">
            <h2 className="text-2xl font-bold mb-4">Total payment</h2>

            <div className="flex justify-between text-gray-700 text-base mb-2">
                <span>Subtotal:</span>
                <span>{subtotal.toLocaleString('vi-VN')}₫</span>
            </div>

            <div className="flex justify-between text-gray-700 text-base mb-2">
                <span>Shipping fee:</span>
                <span>{shippingFee.toLocaleString('vi-VN')}₫</span>
            </div>

            <div className="flex justify-between text-gray-700 text-base mb-4">
                <span>Discount:</span>
                <span>-{discount.toLocaleString('vi-VN')}₫</span>
            </div>

            <div className="flex justify-between font-bold text-xl text-black border-t pt-4">
                <span>Total:</span>
                <span>{grandTotal.toLocaleString('vi-VN')}₫</span>
            </div>
        </div>
    );
};

OrderSummary.propTypes = {
    cartItems: PropTypes.array.isRequired
};

export default OrderSummary;
