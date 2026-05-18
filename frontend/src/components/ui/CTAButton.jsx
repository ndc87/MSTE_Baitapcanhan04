import React from 'react';

/**
 * CTAButton — primary action button for e-commerce pages (Tailwind)
 * 
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 * size: 'sm' | 'md' | 'lg'
 */
const VARIANTS = {
  primary:   'bg-primary-500 hover:bg-primary-dark text-white border border-primary-500 hover:border-primary-dark',
  secondary: 'bg-transparent hover:bg-primary-50 text-primary-600 border border-primary-500',
  ghost:     'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-200',
  danger:    'bg-red-500 hover:bg-red-600 text-white border border-red-500 hover:border-red-600',
  navy:      'bg-navy hover:bg-navy-light text-white border border-navy',
};

const SIZES = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-xl',
};

const CTAButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  fullWidth = false,
  id,
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-poppins font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${base} ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? SIZES.md} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {isLoading && (
        <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default CTAButton;
