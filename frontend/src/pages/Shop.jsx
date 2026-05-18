import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search } from 'lucide-react';
import Layout from '../components/layout/Layout';
import FilterPanel from '../components/filter/FilterPanel';
import FilterDrawer from '../components/filter/FilterDrawer';
import ProductGrid from '../components/product/ProductGrid';
import SearchBar from '../components/search/SearchBar';
import EmptyState from '../components/ui/EmptyState';
import { MOCK_PRODUCTS } from '../mock/products';

const SORT_OPTIONS = [
  { value: '',           label: 'Newest First'       },
  { value: 'price-asc',  label: 'Price: Low → High'  },
  { value: 'price-desc', label: 'Price: High → Low'  },
  { value: 'rating',     label: 'Best Rating'         },
];

const DEFAULT_FILTERS = {
  category: '',
  priceMin:  '',
  priceMax:  '',
  rating:    0,
  inStock:   false,
};

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sort,   setSort]   = useState('');
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: searchParams.get('category') || '',
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Count active filters (for badge)
  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.category) n++;
    if (filters.priceMin)  n++;
    if (filters.priceMax)  n++;
    if (filters.rating)    n++;
    if (filters.inStock)   n++;
    return n;
  }, [filters]);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
  }, []);

  // Filter + sort products
  const filteredProducts = useMemo(() => {
    let list = [...MOCK_PRODUCTS];

    // Search
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.includes(q)
      );
    }

    // Category
    if (filters.category) list = list.filter((p) => p.category === filters.category);

    // Tags from URL
    const tagParam = searchParams.get('tag');
    if (tagParam) list = list.filter((p) => p.tags.includes(tagParam));

    // Price
    if (filters.priceMin) list = list.filter((p) => p.price >= Number(filters.priceMin));
    if (filters.priceMax) list = list.filter((p) => p.price <= Number(filters.priceMax));

    // Rating
    if (filters.rating) list = list.filter((p) => p.rating >= filters.rating);

    // In stock
    if (filters.inStock) list = list.filter((p) => p.stock > 0);

    // Sort
    if (sort === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating')     list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [debouncedSearch, filters, sort, searchParams]);

  return (
    <Layout>
      <div className="section-container py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-poppins font-bold text-2xl text-navy">Shop All Products</h1>
          <p className="text-gray-400 text-sm mt-1">{filteredProducts.length} products found</p>
        </div>

        <div className="flex gap-7 items-start">
          {/* ── Desktop Sidebar ── */}
          <div className="hidden lg:block w-64 shrink-0">
            <FilterPanel filters={filters} onChange={setFilters} onReset={handleReset} />
          </div>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                className="flex-1 min-w-52 max-w-xs"
              />
              <select
                id="shop-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-inter focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white cursor-pointer"
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {filters.category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 border border-primary-200 rounded-full text-xs font-medium text-primary-700">
                    {filters.category}
                    <button onClick={() => setFilters(f => ({ ...f, category: '' }))} className="hover:text-red-500">×</button>
                  </span>
                )}
                {(filters.priceMin || filters.priceMax) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 border border-primary-200 rounded-full text-xs font-medium text-primary-700">
                    ${filters.priceMin || '0'} – ${filters.priceMax || '∞'}
                    <button onClick={() => setFilters(f => ({ ...f, priceMin: '', priceMax: '' }))} className="hover:text-red-500">×</button>
                  </span>
                )}
                {filters.inStock && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 border border-primary-200 rounded-full text-xs font-medium text-primary-700">
                    In stock
                    <button onClick={() => setFilters(f => ({ ...f, inStock: false }))} className="hover:text-red-500">×</button>
                  </span>
                )}
              </div>
            )}

            {/* Product grid or empty state */}
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} isLoading={false} />
            ) : (
              <EmptyState
                title="No products found"
                description="Try adjusting your search or filters to find what you're looking for."
                actionLabel="Clear Filters"
                onAction={handleReset}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter button (floating) ── */}
      <button
        id="mobile-filter-btn"
        onClick={() => setDrawerOpen(true)}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-3 bg-navy text-white rounded-full shadow-hover z-30 font-poppins font-semibold text-sm"
      >
        <SlidersHorizontal size={16} />
        Filters
        {activeCount > 0 && (
          <span className="bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Mobile drawer */}
      <FilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={handleReset}
        activeCount={activeCount}
      />
    </Layout>
  );
};

export default Shop;
