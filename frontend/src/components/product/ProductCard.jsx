import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import Badge from '../ui/Badge';
import StarRating from '../ui/StarRating';
import { addItem } from '../../features/cart/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { id, slug, title, price, oldPrice, discount, stock, rating, reviewCount, images, tags } = product;

  const primaryImage = images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';
  const isOutOfStock  = stock === 0;
  const isSale        = tags?.includes('sale') && discount > 0;
  const isNew         = tags?.includes('new');
  const isHot         = tags?.includes('hot');

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      dispatch(addItem({ ...product, quantity: 1 }));
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
              ${price.toLocaleString()}
            </span>
            {oldPrice && (
              <span className="text-xs text-gray-400 line-through font-inter">
                ${oldPrice.toLocaleString()}
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
