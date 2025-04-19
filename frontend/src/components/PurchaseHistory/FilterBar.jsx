// src/components/PurchaseHistory/FilterBar.jsx
//import React from 'react';
import PropTypes from 'prop-types';

const FILTERS = [
    'Tất cả',
    'Chờ thanh toán',
    'Vận chuyển',
    'Chờ giao hàng',
    'Hoàn thành',
    'Đã hủy',
    'Trả hàng/Hoàn tiền'
];

export default function FilterBar({ selected, onSelect }) {
    return (
        <div className="w-full overflow-x-auto px-2 py-3 no-scrollbar">
            <div className="inline-flex gap-6 bg-gray-100 px-3 py-2 rounded-lg shadow-sm w-full justify-evenly">
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        onClick={() => onSelect(f)}
                        className={`px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap border font-medium
                            ${selected === f
                                ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                                : 'bg-white text-gray-700 border-transparent hover:border-orange-400 hover:text-orange-500'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>
    );
}

FilterBar.propTypes = {
    selected: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
};
