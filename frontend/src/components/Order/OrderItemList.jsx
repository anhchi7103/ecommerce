import PropTypes from 'prop-types';

export default function OrderItemList({ items }) {
    if (!Array.isArray(items)) return null;

    return (
        <div className="text-sm space-y-4">
            <h3 className="font-semibold text-gray-800">Sản phẩm</h3>
            {items.map((item) => (
                <div
                    key={item.name}
                    className="flex items-center border rounded-lg p-3 shadow-sm"
                >
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-gray-600">Số lượng: {item.quantity}</div>
                        <div className="text-gray-600">Giá: {item.price.toLocaleString()} đ</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

OrderItemList.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            image: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
        })
    ).isRequired,
};
