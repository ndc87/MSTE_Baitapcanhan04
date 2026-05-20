import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderById, cancelOrder } from '../redux/orderSlice';
import toast from 'react-hot-toast';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, isLoading } = useSelector(state => state.orders);
  
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [id, dispatch]);

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      return toast.error('Vui lòng nhập lý do hủy');
    }
    await dispatch(cancelOrder({ id: currentOrder._id, reason: cancelReason }));
    setShowCancelModal(false);
    setCancelReason('');
  };

  if (isLoading || !currentOrder) return <div className="p-8 text-center">Đang tải thông tin đơn hàng...</div>;

  const orderTime = new Date(currentOrder.createdAt).getTime();
  const currentTime = new Date().getTime();
  const diffMinutes = Math.floor((currentTime - orderTime) / (1000 * 60));
  
  // Can cancel if < 30 mins OR if status is preparing
  const canCancel = (diffMinutes <= 30 && ['pending', 'confirmed'].includes(currentOrder.status)) || currentOrder.status === 'preparing';

  const steps = [
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'confirmed', label: 'Đã xác nhận' },
    { key: 'preparing', label: 'Đang chuẩn bị' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'completed', label: 'Đã giao' }
  ];

  let currentStepIndex = steps.findIndex(s => s.key === currentOrder.status);
  // If cancelled or anything else, just show logic based on history
  const isCancelled = ['cancelled', 'cancel_requested'].includes(currentOrder.status);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center mb-6 gap-4">
        <Link to="/orders" className="text-gray-500 hover:text-blue-500">&larr; Trở lại</Link>
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng {currentOrder.order_code}</h1>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-6">Trạng thái đơn hàng</h2>
        
        {isCancelled ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center justify-center font-medium">
            {currentOrder.status === 'cancelled' ? 'Đơn hàng đã bị hủy' : 'Đang yêu cầu hủy đơn từ Shop'}
          </div>
        ) : (
          <div className="flex items-center justify-between relative max-w-3xl mx-auto mt-4 mb-8">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
            <div 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-500 -z-10 transition-all duration-500"
              style={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0}%` }}
            ></div>
            
            {steps.map((step, index) => {
              const isActive = index <= currentStepIndex;
              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                    {index + 1}
                  </div>
                  <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Action button */}
        {!isCancelled && currentOrder.status !== 'completed' && currentOrder.status !== 'shipping' && (
          <div className="mt-8 text-center border-t pt-6">
            {canCancel ? (
              <button 
                onClick={() => setShowCancelModal(true)}
                className="px-6 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition"
              >
                {currentOrder.status === 'preparing' ? 'Gửi yêu cầu hủy đơn' : 'Hủy đơn hàng'}
              </button>
            ) : (
              <p className="text-sm text-gray-500">Không thể hủy đơn do đã qua 30 phút hoặc đơn đang được xử lý.</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="font-semibold mb-4 border-b pb-2">Thông tin nhận hàng</h3>
          <p className="mb-2"><span className="text-gray-600">SĐT:</span> <span className="font-medium">{currentOrder.shipping_phone}</span></p>
          <p className="mb-2"><span className="text-gray-600">Địa chỉ:</span> <span className="font-medium">{currentOrder.shipping_address}</span></p>
          <p className="mb-2"><span className="text-gray-600">Thanh toán:</span> <span className="font-medium uppercase">{currentOrder.payment_method}</span></p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="font-semibold mb-4 border-b pb-2">Tổng kết</h3>
          <div className="space-y-3">
            {currentOrder.items.map(item => (
              <div key={item._id} className="flex justify-between text-sm">
                <span>{item.product?.name} x{item.quantity}</span>
                <span>{(item.price_at_buy * item.quantity).toLocaleString()}đ</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t font-bold text-lg">
            <span>Thành tiền:</span>
            <span className="text-red-500">{currentOrder.total_final.toLocaleString()}đ</span>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-[90%]">
            <h3 className="text-lg font-bold mb-4">Lý do hủy đơn</h3>
            <textarea 
              className="w-full border rounded p-2 mb-4 h-24 focus:ring-red-500 focus:border-red-500"
              placeholder="Nhập lý do..."
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                Đóng
              </button>
              <button 
                onClick={handleCancelOrder}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderTrackingPage;
