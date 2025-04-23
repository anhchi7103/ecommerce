import PropTypes from 'prop-types';

const OrderItems = ({ cartItems }) => {
    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-md w-full text-center text-gray-500">
                No item in this order.
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-bold mb-4">Product info</h2>

            <div className="flex flex-col gap-4">
                {cartItems.map((item) => {
                    const itemPrice = item.price || 0; // 🛡️ if item.price undefined, fallback 0
                    const totalItemPrice = (itemPrice * (item.quantity || 0));

                    return (
                        <div
                            key={item._id || item.productId}
                            className="flex items-center gap-4 border-b pb-4"
                        >
                            <img
                                src={Array.isArray(item.images) ? item.images[0] : item.images || '/placeholder.jpg'}
                                alt={item.name}
                                className="w-16 h-16 rounded-md object-cover ring-1 ring-slate-300"
                            />
                            <div className="flex-1">
                                <p className="font-medium text-lg">{item.name}</p>
                                {item.shopName && <p className="text-sm text-gray-500">{item.shopName}</p>}
                                <p className="text-sm text-gray-600">
                                    Unit price: {itemPrice.toLocaleString('vi-VN')}₫
                                </p>
                                <p className="text-sm text-gray-600">
                                    Quantiy: {item.quantity || 0}
                                </p>
                            </div>
                            <p className="font-semibold text-lg">
                                {totalItemPrice.toLocaleString('vi-VN')}₫
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

OrderItems.propTypes = {
    cartItems: PropTypes.array.isRequired
};

export default OrderItems;
