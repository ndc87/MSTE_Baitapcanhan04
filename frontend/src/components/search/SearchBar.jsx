import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, onClear, placeholder = 'Search products…', className = '' }) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white font-inter transition-shadow"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-3 text-gray-300 hover:text-gray-600 transition-colors"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
