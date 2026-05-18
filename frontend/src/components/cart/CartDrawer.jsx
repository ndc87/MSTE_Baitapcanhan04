import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { closeCart } from '../../features/cart/cartSlice';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyState from '../ui/EmptyState';

const CartDrawer = () => {
  const dispatch   = useDispatch();
  const { items, isOpen } = useSelector((state) => state.cart);

  const handleCheckout = () => {
    alert('Checkout — Phase 2 feature. Connect to backend order flow.');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="drawer-overlay"
          onClick={() => dispatch(closeCart())}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="cart-drawer flex flex-col"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-navy" />
            <h2 className="font-poppins font-semibold text-navy text-lg">
              My Cart
              {items.length > 0 && (
                <span className="ml-2 text-sm font-inter text-gray-400">({items.length})</span>
              )}
            </h2>
          </div>
          <button
            id="cart-close-btn"
            onClick={() => dispatch(closeCart())}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Add some products to get started."
            />
          ) : (
            items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))
          )}
        </div>

        {/* Footer summary */}
        {items.length > 0 && (
          <div className="px-5 py-4 shrink-0 border-t border-gray-100">
            <CartSummary items={items} onCheckout={handleCheckout} />
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
