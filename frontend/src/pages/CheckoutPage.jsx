import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal, fetchCart } from '../features/cart/cartSlice';
import { checkout } from '../redux/orderSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address || !phone) {
      return toast.error('Vui lòng nhập đầy đủ địa chỉ và số điện thoại');
    }
    
    const orderData = {
      shipping_address: address,
      shipping_phone: phone,
      payment_method: paymentMethod
    };

    const resultAction = await dispatch(checkout(orderData));
    if (checkout.fulfilled.match(resultAction)) {
      navigate('/orders'); // Go to order history
    }
  };

  if (cartItems.length === 0) {
    return <div className="p-8 text-center">Giỏ hàng trống. Không thể thanh toán.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        
        {/* Shipping Form */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Số điện thoại</label>
            <input 
              type="text" 
              className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Địa chỉ chi tiết</label>
            <textarea 
              className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500" 
              rows="3" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              required
            ></textarea>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Phương thức thanh toán</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
              <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={e => setPaymentMethod(e.target.value)} className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50 opacity-50">
              <input type="radio" name="payment" value="momo" disabled className="w-5 h-5" />
              <span className="font-medium">Ví Momo (Đang bảo trì)</span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 bg-gray-50 p-6 rounded-lg border h-fit">
          <h2 className="text-xl font-semibold mb-4">Đơn hàng của bạn</h2>
          <div className="space-y-4 mb-4 border-b pb-4">
            {cartItems.map(item => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="truncate pr-4 flex-1">{item.title} x {item.quantity}</span>
                <span className="font-medium">{(item.price * item.quantity).toLocaleString()}đ</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Tạm tính:</span>
            <span className="font-medium">{total.toLocaleString()}đ</span>
          </div>
          <div className="flex justify-between mb-4 pb-4 border-b">
            <span className="text-gray-600">Phí vận chuyển:</span>
            <span className="font-medium">30,000đ</span>
          </div>
          <div className="flex justify-between mb-6">
            <span className="font-bold text-lg">Tổng cộng:</span>
            <span className="font-bold text-red-500 text-xl">{(total + 30000).toLocaleString()}đ</span>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
            ĐẶT HÀNG
          </button>
        </div>

      </form>
    </div>
  );
};

export default CheckoutPage;
