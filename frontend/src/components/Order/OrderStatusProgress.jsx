// src/components/Order/OrderStatusProgress.jsx
import React from 'react';
import PropTypes from 'prop-types';
import {
    FaShoppingCart,
    FaCreditCard,
    FaTruck,
    FaBox,
    FaCheckCircle,
} from 'react-icons/fa';

// Định nghĩa thứ tự và icon cho mỗi bước
const STEPS = [
    { key: 'Đơn hàng đã đặt', label: 'Đơn hàng đã đặt', icon: FaShoppingCart },
    { key: 'Đã xác nhận thông tin thanh toán', label: 'Xác nhận thanh toán', icon: FaCreditCard },
    { key: 'Đã giao cho ĐVVC', label: 'Giao cho ĐVVC', icon: FaTruck },
    { key: 'Đã nhận được hàng', label: 'Đã nhận hàng', icon: FaBox },
    { key: 'Đơn hàng đã hoàn thành', label: 'Hoàn thành', icon: FaCheckCircle },
];

export default function OrderStatusProgress({ history }) {
    // Tập hợp các status đã hoàn thành
    const doneStatuses = new Set(history.map((h) => h.status));
    // Bước hiện tại chính là phần tử cuối của history
    const currentStatus = history[history.length - 1]?.status;

    return (
        <div className="flex items-center mb-6">
            {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isDone = doneStatuses.has(step.key);
                const isCurrent = step.key === currentStatus;
                const colorClass = isDone
                    ? 'text-blue-600'
                    : isCurrent
                        ? 'text-blue-400'
                        : 'text-gray-300';

                return (
                    <React.Fragment key={step.key}>
                        {/* Icon + label */}
                        <div className="flex flex-col items-center text-center">
                            <Icon className={`w-8 h-8 ${colorClass}`} />
                            <span className={`mt-2 text-xs font-medium ${colorClass}`}>
                                {step.label}
                            </span>
                            {isDone && (
                                <span className="mt-1 text-xxs text-gray-500">
                                    {history.find((h) => h.status === step.key)?.time}
                                </span>
                            )}
                        </div>

                        {/* Connector line, không xuất ở cuối */}
                        {idx < STEPS.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 mx-2 ${doneStatuses.has(STEPS[idx + 1].key)
                                        ? 'bg-blue-600'
                                        : 'bg-gray-300'
                                    }`}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

OrderStatusProgress.propTypes = {
    history: PropTypes.arrayOf(
        PropTypes.shape({
            status: PropTypes.string.isRequired,
            time: PropTypes.string.isRequired,
        })
    ).isRequired,
};
