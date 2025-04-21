// src/data/mockOrders.js
const mockOrders = [
    {
        orderId: 'DH001',
        status: {
            currentStatus: 'Đã giao cho ĐVVC',
            history: [
                { status: 'Đơn hàng đã đặt', time: '2025-04-01 10:00' },
                { status: 'Đã xác nhận thông tin thanh toán', time: '2025-04-01 10:05' },
                { status: 'Đã giao cho ĐVVC', time: '2025-04-02 08:00' },
                //{ status: 'Đã nhận được hàng', time: '2025-04-03 12:30' },
                //{ status: 'Đơn hàng đã hoàn thành', time: '2025-04-04 14:00' },
            ],
        },
        buyer: {
            name: 'Nguyễn Văn A',
            phone: '0909123456',
            address: '123 Đường ABC, Quận 1, TP.HCM',
        },
        shipping: {
            provider: 'Giao Hàng Nhanh',
            trackingNumber: 'GHN123456789',
        },
        shop: {
            name: 'Shop Điện Tử ABC',
        },
        items: [
            {
                name: 'Tai nghe Bluetooth XYZ',
                image: 'https://via.placeholder.com/80',
                quantity: 1,
                price: 300000,
            },
        ],
        summary: {
            itemsTotal: 300000,
            shippingFee: 25000,
            shippingDiscount: 10000,
            voucherDiscount: 15000,
            total: 300000,
        },
        paymentMethod: 'Thanh toán khi nhận hàng',
    },
];

export default mockOrders;
