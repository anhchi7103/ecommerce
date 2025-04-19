import PropTypes from 'prop-types';

export default function ShippingInfo({ info, onChange }) {
    return (
        <section className="my-6 p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Địa chỉ nhận hàng</h3>
            <input
                className="block w-full mb-2 p-2 border rounded"
                name="name"
                placeholder="Họ tên"
                value={info.name}
                onChange={onChange}
            />
            <input
                className="block w-full mb-2 p-2 border rounded"
                name="address"
                placeholder="Địa chỉ"
                value={info.address}
                onChange={onChange}
            />
            <input
                className="block w-full mb-2 p-2 border rounded"
                name="phone"
                placeholder="Số điện thoại"
                value={info.phone}
                onChange={onChange}
            />
        </section>
    );
}

ShippingInfo.propTypes = {
    info: PropTypes.shape({
        name: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
};
