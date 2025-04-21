import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export default function ShippingInfo({ onChange }) {
    const [info, setInfo] = useState({
        name: '',
        address: '',
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
                    const addressObj = user.address?.[0]; // First saved address
                    const fullAddress = addressObj
                        ? `${addressObj.street}, ${addressObj.city}, ${addressObj.country}`
                        : '';

                    const updatedInfo = {
                        name: `${user.first_name} ${user.last_name}`,
                        address: fullAddress,
                        phone: user.phone_number || ''
                    };

                    setInfo(updatedInfo);
                    onChange({ target: { name: 'name', value: updatedInfo.name } });
                    onChange({ target: { name: 'address', value: updatedInfo.address } });
                    onChange({ target: { name: 'phone', value: updatedInfo.phone } });
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        }

        fetchUser();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...info, [name]: value };
        setInfo(updated);
        onChange(e); // also notify parent
    };

    return (
        <section className="my-6 p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Địa chỉ nhận hàng</h3>
            <input
                className="block w-full mb-2 p-2 border rounded"
                name="name"
                placeholder="Họ tên"
                value={info.name}
                onChange={handleInputChange}
            />
            <input
                className="block w-full mb-2 p-2 border rounded"
                name="address"
                placeholder="Địa chỉ"
                value={info.address}
                onChange={handleInputChange}
            />
            <input
                className="block w-full mb-2 p-2 border rounded"
                name="phone"
                placeholder="Số điện thoại"
                value={info.phone}
                onChange={handleInputChange}
            />
        </section>
    );
}

ShippingInfo.propTypes = {
    onChange: PropTypes.func.isRequired,
};
