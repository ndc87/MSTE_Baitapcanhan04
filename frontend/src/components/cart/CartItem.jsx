import React from 'react';
import { useDispatch } from 'react-redux';
import { Trash2, Minus, Plus } from 'lucide-react';
import { removeItem, updateQuantity } from '../../features/cart/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const { id, title, price, images, quantity, stock } = item;

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* Image */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
        <img src={images?.[0]} alt={title} className="w-full h-full object-cover" loading="lazy" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-poppins font-semibold text-sm text-navy line-clamp-2 leading-snug">{title}</p>
        <p className="text-primary-500 font-bold text-sm mt-1">${price}</p>

        {/* Qty + Remove */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => dispatch(quantity === 1 ? removeItem(id) : updateQuantity({ id, quantity: quantity - 1 }))}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500"
              aria-label="Decrease"
            >
              <Minus size={13} />
            </button>
            <span className="w-8 h-8 flex items-center justify-center font-semibold text-sm text-navy border-x border-gray-200">
              {quantity}
            </span>
            <button
              onClick={() => dispatch(updateQuantity({ id, quantity: Math.min(quantity + 1, stock) }))}
              disabled={quantity >= stock}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500 disabled:opacity-30"
              aria-label="Increase"
            >
              <Plus size={13} />
            </button>
          </div>
          <button
            onClick={() => dispatch(removeItem(id))}
            className="text-gray-300 hover:text-red-400 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
