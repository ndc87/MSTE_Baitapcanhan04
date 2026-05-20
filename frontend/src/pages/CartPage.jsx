import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeCartItem, selectCartItems, selectCartTotal } from '../features/cart/cartSlice';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const { isLoading } = useSelector(state => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdate = (itemId, quantity) => {
    if (quantity > 0) {
      dispatch(updateCartItem({ itemId, quantity }));
    }
  };

  const handleRemove = (itemId) => {
    dispatch(removeCartItem(itemId));
  };

  if (isLoading) return <div className="p-8 text-center">Đang tải giỏ hàng...</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p>Giỏ hàng trống.</p>
          <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4 border-b py-4">
                <img src={item.images[0] || 'https://via.placeholder.com/80'} alt={item.title} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-red-500 font-bold">{item.price.toLocaleString()}đ</p>
                </div>
                <div className="flex items-center border rounded">
                  <button onClick={() => handleUpdate(item._id, item.quantity - 1)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200">-</button>
                  <span className="px-4">{item.quantity}</span>
                  <button onClick={() => handleUpdate(item._id, item.quantity + 1)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200">+</button>
                </div>
                <button onClick={() => handleRemove(item._id)} className="text-red-500 hover:text-red-700 ml-4">
                  Xóa
                </button>
              </div>
            ))}
          </div>
          
          <div className="w-full lg:w-80 bg-gray-50 p-6 rounded-lg h-fit">
            <h3 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h3>
            <div className="flex justify-between mb-2">
              <span>Tổng tiền:</span>
              <span className="font-bold text-red-500 text-xl">{total.toLocaleString()}đ</span>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
