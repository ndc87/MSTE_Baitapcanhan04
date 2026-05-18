import React from 'react';
import { Minus, Plus } from 'lucide-react';

const QuantitySelector = ({ value = 1, onChange, min = 1, max = 99, disabled = false }) => {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };
  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-navy hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Minus size={14} />
      </button>

      <span className="w-10 h-10 flex items-center justify-center font-poppins font-semibold text-navy text-sm border-x border-gray-200 select-none">
        {value}
      </span>

      <button
        type="button"
        onClick={increment}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-navy hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

export default QuantitySelector;
