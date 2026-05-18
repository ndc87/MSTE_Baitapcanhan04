import React from 'react';
import { Link } from 'react-router-dom';
import CTAButton from '../ui/CTAButton';
import { Truck } from 'lucide-react';

const CartSummary = ({ items, onCheckout }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 50;
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="border-t border-gray-100 pt-4 space-y-4">
      {/* Shipping nudge */}
      {remainingForFree > 0 ? (
        <div className="bg-primary-50 rounded-xl p-3">
          <div className="flex items-center gap-2 text-primary-700 text-sm">
            <Truck size={15} />
            <span>Add <strong>${remainingForFree.toFixed(2)}</strong> more for free shipping!</span>
          </div>
          <div className="mt-2 h-1.5 bg-primary-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-primary-600 text-sm font-medium">
          <Truck size={15} />
          <span>🎉 You qualify for free shipping!</span>
        </div>
      )}

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
          <span className="font-semibold text-navy">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Shipping</span>
          <span>{subtotal >= freeShippingThreshold ? 'Free' : 'Calculated at checkout'}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <span className="font-poppins font-bold text-navy">Total</span>
        <span className="font-poppins font-bold text-xl text-navy">${subtotal.toFixed(2)}</span>
      </div>

      <CTAButton id="checkout-btn" onClick={onCheckout} fullWidth size="lg">
        Proceed to Checkout
      </CTAButton>

      <Link
        to="/shop"
        className="block text-center text-sm text-gray-400 hover:text-primary-500 transition-colors"
      >
        Continue Shopping →
      </Link>
    </div>
  );
};

export default CartSummary;
