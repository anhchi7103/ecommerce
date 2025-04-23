import PropTypes from 'prop-types';

export default function OrderItemList({ items }) {
    if (!Array.isArray(items)) return null;

    return (
        <div className="text-sm space-y-4">
            <h3 className="font-semibold text-gray-800">Product</h3>
            {items.map((item, idx) => (
                <div
                    key={item.product_name || idx}
                    className="flex items-center border rounded-lg p-3 shadow-sm"
                >
                    <img
                        src={item.image_url || item.image || 'https://via.placeholder.com/64'}
                        alt={item.product_name || 'Product'}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.product_name || item.name}</div>
                        <div className="text-gray-600">Quantity: {item.quantity ?? 'N/A'}</div>
                        <div className="text-gray-600">
                            Price: {(item.item_price || item.price || 0).toLocaleString()} đ
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}


OrderItemList.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            product_name: PropTypes.string.isRequired,
            image_url: PropTypes.string,
            quantity: PropTypes.number.isRequired,
            item_price: PropTypes.number,
        })
    ).isRequired,
};
