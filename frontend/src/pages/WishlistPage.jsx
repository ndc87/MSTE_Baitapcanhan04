import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/layout/Layout';
import { addToCart } from '../features/cart/cartSlice';
import api from '../services/api';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.get('/users/wishlist')
      .then((res) => setItems(res.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleRemove = async (productId) => {
    try {
      await api.post(`/users/wishlist/${productId}`);
      setItems((prev) => prev.filter((p) => p._id !== productId));
      toast.success('Đã xóa khỏi yêu thích');
    } catch {
      toast.error('Lỗi khi xóa');
    }
  };

  const handleAddToCart = (productId) => {
    dispatch(addToCart({ productId, quantity: 1 }));
  };

  if (!user) {
    return (
      <Layout>
        <div className="section-container py-20 text-center">
          <Heart size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="font-poppins font-bold text-xl text-navy mb-2">Đăng nhập để xem Wishlist</h2>
          <p className="text-gray-400 mb-6">Bạn cần đăng nhập để lưu sản phẩm yêu thích.</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors">
            Đăng nhập
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-container py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <Heart size={20} className="text-red-500" />
          </div>
          <div>
            <h1 className="font-poppins font-bold text-2xl text-navy">Sản phẩm yêu thích</h1>
            <p className="text-gray-400 text-sm">{items.length} sản phẩm</p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse" style={{ boxShadow: 'var(--shadow-card)' }}>
                <div className="aspect-square bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-5">
              <Heart size={32} className="text-gray-300" />
            </div>
            <h3 className="font-poppins font-semibold text-lg text-navy mb-2">Chưa có sản phẩm yêu thích</h3>
            <p className="text-gray-400 text-sm mb-6">Bấm ❤️ trên sản phẩm bất kỳ để thêm vào đây.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors">
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((product) => {
              const image = product.media?.[0]?.media_url || 'https://placehold.co/400x400';
              return (
                <div key={product._id} className="bg-white rounded-2xl overflow-hidden group" style={{ boxShadow: 'var(--shadow-card)' }}>
                  {/* Image */}
                  <Link to={`/products/${product.slug}`} className="block relative overflow-hidden bg-gray-50" style={{ aspectRatio: '1/1' }}>
                    <img src={image} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    {/* Remove button */}
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(product._id); }}
                      className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-red-50 transition-all shadow-sm hover:shadow-md"
                      title="Xóa khỏi yêu thích"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                    {/* Filled heart indicator */}
                    <div className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10">
                      <Heart size={14} className="text-red-500 fill-red-500" />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <Link to={`/products/${product.slug}`} className="block">
                      <h3 className="font-poppins font-semibold text-sm text-navy leading-snug line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-poppins font-bold text-lg text-primary-500">
                        {(product.base_price || 0).toLocaleString()}đ
                      </span>
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-primary-500 hover:bg-primary-dark text-white transition-colors"
                        title="Thêm vào giỏ hàng"
                      >
                        <ShoppingCart size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WishlistPage;
