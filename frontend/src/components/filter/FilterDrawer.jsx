import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import FilterPanel from './FilterPanel';
import CTAButton from '../ui/CTAButton';

const FilterDrawer = ({ isOpen, onClose, filters, onChange, onReset, activeCount }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="drawer-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="drawer-panel pb-safe" role="dialog" aria-modal="true" aria-label="Product filters">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-navy" />
            <h3 className="font-poppins font-semibold text-navy">Filters</h3>
            {activeCount > 0 && (
              <span className="bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close filters"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Filter content — reuse FilterPanel layout but without sticky */}
        <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          <FilterPanel filters={filters} onChange={onChange} onReset={onReset} />
        </div>

        {/* Footer CTA */}
        <div className="px-5 py-4 border-t border-gray-100 bg-white">
          <div className="flex gap-3">
            <button
              onClick={onReset}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            <CTAButton
              onClick={onClose}
              fullWidth
              size="md"
              className="flex-1"
            >
              Apply Filters
            </CTAButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;
