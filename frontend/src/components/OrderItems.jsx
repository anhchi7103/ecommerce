//import { useContext } from 'react';
//import { ShopContext } from '../Context/ShopContext';
import PropTypes from 'prop-types';

const OrderItems = ({ cartItems }) => {
    return (
        <div className='bg-white p-4 rounded-lg shadow-md w-full'>
            <h2 className='bold-20 mb-4'>Thông tin sản phẩm</h2>
            <div className='flex flex-col gap-4'>
                {Object.values(cartItems).map((item) => {
                    if (item.quantity > 0) {
                        return (
                            <div key={item._id} className='flex items-center gap-4 border-b pb-4'>
                                <img src={item.images} alt={item.name} className='w-16 h-16 rounded-md object-cover ring-1 ring-slate-300' />
                                <div className='flex-1'>
                                    <p className='font-medium text-lg'>{item.name}</p>
                                    <p className='text-sm text-gray-500'>{item.shopName}</p>
                                    <p className='text-sm text-gray-600'>Đơn giá: {item.price.toLocaleString('vi-VN')}₫</p>
                                    <p className='text-sm text-gray-600'>Số lượng: {item.quantity}</p>
                                </div>
                                <p className='font-semibold text-lg'>
                                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                </p>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default OrderItems;
OrderItems.propTypes = {
    cartItems: PropTypes.object.isRequired
};


