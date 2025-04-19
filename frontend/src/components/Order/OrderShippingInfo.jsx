// src/components/Order/OrderShippingInfo.jsx
import PropTypes from 'prop-types';

export default function OrderShippingInfo({ shipping }) {
    if (!shipping) return null;

    return (
        <div className="text-sm space-y-1">
            <h3 className="font-semibold text-gray-800 mb-1">Thông tin vận chuyển</h3>
            <div>
                <strong>Đơn vị vận chuyển:</strong> {shipping.provider}
            </div>
            <div>
                <strong>Mã vận đơn:</strong> {shipping.trackingNumber}
            </div>
        </div>
    );
}

OrderShippingInfo.propTypes = {
    shipping: PropTypes.shape({
        provider: PropTypes.string.isRequired,
        trackingNumber: PropTypes.string.isRequired,
    }).isRequired,
};
