import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/orderSlice';
import { Link } from 'react-router-dom';

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return { text: 'Mới đặt', color: 'text-blue-500 bg-blue-50' };
      case 'confirmed': return { text: 'Đã xác nhận', color: 'text-indigo-500 bg-indigo-50' };
      case 'preparing': return { text: 'Đang chuẩn bị', color: 'text-orange-500 bg-orange-50' };
      case 'shipping': return { text: 'Đang giao', color: 'text-purple-500 bg-purple-50' };
      case 'completed': return { text: 'Hoàn thành', color: 'text-green-500 bg-green-50' };
      case 'cancelled': return { text: 'Đã hủy', color: 'text-red-500 bg-red-50' };
      case 'cancel_requested': return { text: 'Yêu cầu hủy', color: 'text-red-600 bg-red-100' };
      default: return { text: status, color: 'text-gray-500 bg-gray-50' };
    }
  };

  if (isLoading) return <div className="p-8 text-center">Đang tải lịch sử mua hàng...</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Lịch sử mua hàng</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>Bạn chưa có đơn hàng nào.</p>
          <Link to="/" className="text-blue-500 mt-4 inline-block hover:underline">Bắt đầu mua sắm</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const statusInfo = getStatusText(order.status);
            return (
              <div key={order._id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow transition">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b">
                  <div>
                    <p className="font-semibold text-lg">Mã đơn: {order.order_code}</p>
                    <p className="text-sm text-gray-500">Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  {order.items.map(item => (
                    <div key={item._id} className="flex items-center gap-4">
                      <img src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/50'} alt="product" className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product?.name || 'Sản phẩm không còn tồn tại'}</p>
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                      </div>
                      <p className="font-medium">{(item.price_at_buy * item.quantity).toLocaleString()}đ</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t gap-4">
                  <p className="font-bold">Tổng tiền: <span className="text-red-500 text-lg">{order.total_final.toLocaleString()}đ</span></p>
                  <Link 
                    to={`/orders/${order._id}`}
                    className="px-6 py-2 bg-blue-50 text-blue-600 rounded font-medium hover:bg-blue-100 transition w-full md:w-auto text-center"
                  >
                    Xem chi tiết & Theo dõi
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
