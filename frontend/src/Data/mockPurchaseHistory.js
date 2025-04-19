// src/data/mockPurchaseHistory.js
export const mockPurchaseHistory = [
  {
    orderId: 'DH001',
    shop: { name: 'Shop Điện Tử ABC' },
    status: {
      currentStatus: 'Đơn hàng đã đặt',
      history: [
        { status: 'Đơn hàng đã đặt', time: '2025-04-10 09:00' }
      ],
    },
    buyer: { name: 'Nguyễn Văn A', phone: '0909123456', address: '123 ABC, Q1, HCM' },
    shipping: { provider: 'Giao Hàng Nhanh', trackingNumber: 'GHN001' },
    items: [
      { name: 'Sản phẩm A', image: 'https://via.placeholder.com/80', quantity: 2, price: 120000 },
    ],
    summary: { total: 240000 },
  },
  {
    orderId: 'DH002',
    shop: { name: 'Shop Thời Trang XYZ' },
    status: { currentStatus: 'Đã giao cho ĐVVC', history: [ { status: 'Đơn hàng đã đặt', time: '2025-04-11 10:00' }, { status: 'Đã giao cho ĐVVC', time: '2025-04-11 14:00' } ] },
    buyer: { name: 'Nguyễn Văn A', phone: '0909123456', address: '123 ABC, Q1, HCM' },
    shipping: { provider: 'Viettel Post', trackingNumber: 'VTP002' },
    items: [
      { name: 'Sản phẩm B', image: 'https://via.placeholder.com/80', quantity: 1, price: 350000 },
    ],
    summary: { total: 350000 },
  },
  {
    orderId: 'DH003',
    shop: { name: 'Shop Đồ Gia Dụng' },
    status: { currentStatus: 'Đơn hàng đã hoàn thành', history: [ { status: 'Đơn hàng đã đặt', time: '2025-04-12 08:30' }, { status: 'Đã giao cho ĐVVC', time: '2025-04-12 12:00' }, { status: 'Đơn hàng đã hoàn thành', time: '2025-04-13 16:45' } ] },
    buyer: { name: 'Nguyễn Văn A', phone: '0909123456', address: '123 ABC, Q1, HCM' },
    shipping: { provider: 'Giao Hàng Nhanh', trackingNumber: 'GHN003' },
    items: [
      { name: 'Sản phẩm C', image: 'https://via.placeholder.com/80', quantity: 3, price: 80000 },
    ],
    summary: { total: 240000 },
  }
];
