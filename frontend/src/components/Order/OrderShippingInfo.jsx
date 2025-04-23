// src/components/Order/OrderShippingInfo.jsx
import PropTypes from 'prop-types';

export default function OrderShippingInfo({ shipping }) {
    if (!shipping) return null;

    return (
        <div className="text-sm space-y-1">
            <h3 className="font-semibold text-gray-800 mb-1">Shipping info</h3>
            <div>
                <strong>Shipping unit:</strong> {shipping.provider}
            </div>
            <div>
                <strong>Tracking number:</strong> {shipping.trackingNumber}
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
