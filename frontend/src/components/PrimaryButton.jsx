import React from 'react';

const PrimaryButton = ({ children, onClick, type = 'button', isLoading = false, className = '' }) => {
  return (
    <button
      type={type}
      className={`btn fw-semibold w-100 ${className}`}
      onClick={onClick}
      disabled={isLoading}
      style={{
        backgroundColor: '#10b981',
        borderColor: '#10b981',
        color: 'white',
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#059669'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#10b981'}
    >
      {isLoading && (
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
      )}
      {children}
    </button>
  );
};

export default PrimaryButton;
