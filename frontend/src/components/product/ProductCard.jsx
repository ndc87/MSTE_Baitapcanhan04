import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Badge from '../ui/Badge';
import StarRating from '../ui/StarRating';
import { addToCart } from '../../features/cart/cartSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { id, slug, title, price, oldPrice, discount, stock, rating, reviewCount, images, tags } = product;

  const primaryImage = images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';
  const isOutOfStock  = stock === 0;
  const isSale        = tags?.includes('sale') && discount > 0;
  const isNew         = tags?.includes('new');
  const isHot         = tags?.includes('hot');

  const [wishlisted, setWishlisted] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      dispatch(addToCart({ productId: product.id || product._id, quantity: 1 }));
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Vui lòng đăng nhập để sử dụng Wishlist');
      return;
    }
    setWishLoading(true);
    try {
      const res = await api.post(`/users/wishlist/${product.id || product._id}`);
      const action = res.data?.data?.action;
      setWishlisted(action === 'added');
      toast.success(action === 'added' ? 'Đã thêm vào yêu thích ❤️' : 'Đã xóa khỏi yêu thích');
    } catch {
      toast.error('Lỗi khi cập nhật Wishlist');
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <Link
      to={`/products/${slug}`}
      className="group block bg-white rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      style={{ boxShadow: 'var(--shadow-card)', textDecoration: 'none' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-hover)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-card)'}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '1/1' }}>
        <img
          src={primaryImage}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges — top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isOutOfStock && <Badge variant="outofstock">Out of Stock</Badge>}
          {isSale && !isOutOfStock && <Badge variant="sale">-{discount}%</Badge>}
          {isNew && !isOutOfStock && <Badge variant="new">New</Badge>}
          {isHot && !isOutOfStock && <Badge variant="hot">Hot</Badge>}
        </div>

        {/* Wishlist — top right */}
        <button
          onClick={handleToggleWishlist}
          disabled={wishLoading}
          aria-label={`Toggle wishlist for ${title}`}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm hover:shadow-md disabled:opacity-50"
        >
          <Heart
            size={16}
            className={`transition-colors ${wishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-poppins font-semibold text-sm text-navy leading-snug line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={rating} reviewCount={reviewCount} size={12} />
        </div>

        {/* Price row + Add to cart */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-poppins font-bold text-lg text-primary-500">
              {price?.toLocaleString()}đ
            </span>
            {oldPrice && (
              <span className="text-xs text-gray-400 line-through font-inter">
                {oldPrice?.toLocaleString()}đ
              </span>
            )}
          </div>

          <button
            id={`add-to-cart-${id}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={`Add ${title} to cart`}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-primary-500 hover:bg-primary-dark text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
