import React from 'react';
import { Star } from 'lucide-react';
import { MOCK_CATEGORIES } from '../../mock/categories';

const SORT_OPTIONS = [
  { value: '',          label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc',label: 'Price: High to Low' },
  { value: 'rating',    label: 'Best Rating' },
];

const FilterPanel = ({ filters, onChange, onReset }) => {
  const { category, priceMin, priceMax, rating, inStock } = filters;

  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <aside className="bg-white rounded-2xl p-5 sticky top-24" style={{ boxShadow: 'var(--shadow-card)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-poppins font-semibold text-navy text-base">Filters</h3>
        <button
          onClick={onReset}
          className="text-xs text-primary-500 hover:text-primary-dark font-semibold transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Category */}
      <div className="mb-6">
        <p className="font-inter font-medium text-xs text-gray-500 uppercase tracking-widest mb-3">Category</p>
        <div className="space-y-1">
          <label className="flex items-center gap-3 py-1.5 cursor-pointer group">
            <input
              type="radio"
              name="category"
              value=""
              checked={!category}
              onChange={() => set('category', '')}
              className="accent-primary-500 w-4 h-4"
            />
            <span className="text-sm text-gray-600 group-hover:text-navy transition-colors">All Categories</span>
          </label>
          {MOCK_CATEGORIES.map(({ slug, label, icon }) => (
            <label key={slug} className="flex items-center gap-3 py-1.5 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={slug}
                checked={category === slug}
                onChange={() => set('category', slug)}
                className="accent-primary-500 w-4 h-4"
              />
              <span className="text-sm text-gray-600 group-hover:text-navy transition-colors flex items-center gap-1.5">
                <span>{icon}</span> {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="mb-6">
        <p className="font-inter font-medium text-xs text-gray-500 uppercase tracking-widest mb-3">Price Range</p>
        <div className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => set('priceMin', e.target.value)}
              className="w-full pl-7 pr-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <span className="text-gray-400 text-xs">–</span>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => set('priceMax', e.target.value)}
              className="w-full pl-7 pr-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <p className="font-inter font-medium text-xs text-gray-500 uppercase tracking-widest mb-3">Minimum Rating</p>
        <div className="space-y-1">
          {[0, 3, 4, 4.5].map((r) => (
            <label key={r} className="flex items-center gap-3 py-1.5 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                value={r}
                checked={rating === r}
                onChange={() => set('rating', r)}
                className="accent-primary-500 w-4 h-4"
              />
              <span className="flex items-center gap-1 text-sm text-gray-600 group-hover:text-navy transition-colors">
                {r === 0
                  ? 'All ratings'
                  : (
                    <>
                      {r}+ <Star size={12} className="text-amber-400 fill-amber-400 inline" />
                    </>
                  )
                }
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* In stock toggle */}
      <div className="flex items-center justify-between py-3 border-t border-gray-100">
        <span className="text-sm font-inter text-gray-700">In Stock Only</span>
        <button
          type="button"
          role="switch"
          aria-checked={inStock}
          onClick={() => set('inStock', !inStock)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
            inStock ? 'bg-primary-500' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
              inStock ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </aside>
  );
};

export default FilterPanel;
