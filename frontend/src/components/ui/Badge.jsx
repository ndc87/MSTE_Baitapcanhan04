import React from 'react';

/**
 * Badge — product label chips
 * variant: 'sale' | 'new' | 'hot' | 'outofstock' | 'featured'
 */
const STYLES = {
  sale:       'bg-red-500 text-white',
  new:        'bg-primary-500 text-white',
  hot:        'bg-orange-500 text-white',
  featured:   'bg-navy text-white',
  outofstock: 'bg-gray-200 text-gray-500',
  discount:   'bg-amber-400 text-amber-900',
};

const Badge = ({ variant = 'new', children, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-poppins font-semibold uppercase tracking-wide ${
        STYLES[variant] ?? STYLES.new
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
