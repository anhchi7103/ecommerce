/* ===== 📄 ShippingInfo.jsx (Full file đã fix đủ 3 trường địa chỉ riêng biệt) ===== */

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export default function ShippingInfo({ onChange }) {
    const [info, setInfo] = useState({
        name: '',
        address_id: '',
        street: '',
        city: '',
        country: '',
        phone: ''
    });

    const userId = localStorage.getItem('UserID');

    useEffect(() => {
        async function fetchUser() {
            if (!userId || userId.length !== 24) {
                console.error('Invalid userId in localStorage');
                return;
            }

            try {
                const res = await axios.get(`http://localhost:4000/user/${userId}`);
                const user = res.data;

                if (user) {
                    const addressObj = user.address?.[0] || {};

                    const updatedInfo = {
                        name: `${user.first_name} ${user.last_name}`,
                        address_id: addressObj.address_id || '',
                        street: addressObj.street || '',
                        city: addressObj.city || '',
                        country: addressObj.country || '',
                        phone: user.phone_number || ''
                    };


                    setInfo(updatedInfo);

                    // Gửi dữ liệu lên parent component
                    onChange({ target: { name: 'address_id', value: updatedInfo.address_id } });
                    onChange({ target: { name: 'street', value: updatedInfo.street } });
                    onChange({ target: { name: 'city', value: updatedInfo.city } });
                    onChange({ target: { name: 'country', value: updatedInfo.country } });
                    onChange({ target: { name: 'phone', value: updatedInfo.phone } });
                    onChange({ target: { name: 'name', value: updatedInfo.name } });

                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        }

        fetchUser();
    }, [userId, onChange]);

    return (
        <section className="my-6 p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Shipping address</h3>

            {/* Họ tên */}
            <input
                className="block w-full mb-2 p-2 border rounded bg-gray-100"
                name="name"
                placeholder="Full name"
                value={info.name}
                readOnly
            />

            {/* Đường/Số nhà */}
            <input
                className="block w-full mb-2 p-2 border rounded bg-gray-100"
                name="street"
                placeholder="Street / House Number"
                value={info.street}
                readOnly
            />

            {/* Thành phố */}
            <input
                className="block w-full mb-2 p-2 border rounded bg-gray-100"
                name="city"
                placeholder="City"
                value={info.city}
                readOnly
            />

            {/* Quốc gia */}
            <input
                className="block w-full mb-2 p-2 border rounded bg-gray-100"
                name="country"
                placeholder="Country"
                value={info.country}
                readOnly
            />

            {/* Số điện thoại */}
            <input
                className="block w-full mb-2 p-2 border rounded bg-gray-100"
                name="phone"
                placeholder="Phone number"
                value={info.phone}
                readOnly
            />
            <input type="hidden" name="address_id" value={info.address_id} />

        </section>
    );
}

ShippingInfo.propTypes = {
    onChange: PropTypes.func.isRequired,
};
