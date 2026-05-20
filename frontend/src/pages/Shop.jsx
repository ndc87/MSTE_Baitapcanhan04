import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import Layout from '../components/layout/Layout';
import FilterPanel from '../components/filter/FilterPanel';
import FilterDrawer from '../components/filter/FilterDrawer';
import ProductGrid from '../components/product/ProductGrid';
import SearchBar from '../components/search/SearchBar';
import EmptyState from '../components/ui/EmptyState';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import api from '../services/api';

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
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sort,   setSort]   = useState('');
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: searchParams.get('category') || '',
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const loadMoreRef = useRef(null);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const tagParam = searchParams.get('tag') || '';

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
  const activeCategoryLabel = useMemo(() => {
    if (!filters.category) return '';
    return categories.find((item) => item.slug === filters.category)?.name || filters.category;
  }, [categories, filters.category]);

  const handleReset = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
    setSearchQuery('');
  }, []);

  const fetchProducts = useCallback(async (nextPage, shouldReset = false) => {
    if (shouldReset) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      const params = {
        page: nextPage,
        limit: 12,
        sort,
        search: debouncedSearch || undefined,
        category: filters.category || undefined,
        priceMin: filters.priceMin || undefined,
        priceMax: filters.priceMax || undefined,
        rating: filters.rating || undefined,
        inStock: filters.inStock ? 'true' : undefined,
        tag: tagParam || undefined
      };

      const { data } = await api.get('/products', { params });
      const payload = data?.data;
      const items = payload?.items || [];
      const total = payload?.total || 0;
      const totalPages = payload?.totalPages || 1;

      if (shouldReset) {
        setProducts(items);
      } else {
        setProducts((prev) => [...prev, ...items]);
      }
      setTotalCount(total);
      setPage(nextPage);
      setHasMore(nextPage < totalPages);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm.');
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [debouncedSearch, filters, sort, tagParam]);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        if (!isMounted) return;
        setCategories(data?.data?.items || []);
      } catch (err) {
        if (isMounted) setCategories([]);
      }
    };
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchProducts(1, true);
  }, [fetchProducts]);

  // Sync URL search params → component state (one-way: URL → state only)
  const prevParamsRef = useRef({ category: searchParams.get('category') || '', search: searchParams.get('search') || '' });
  useEffect(() => {
    const nextCategory = searchParams.get('category') || '';
    const nextSearch = searchParams.get('search') || '';

    if (nextCategory !== prevParamsRef.current.category) {
      setFilters((prev) => ({ ...prev, category: nextCategory }));
      prevParamsRef.current.category = nextCategory;
    }
    if (nextSearch !== prevParamsRef.current.search) {
      setSearchQuery(nextSearch);
      prevParamsRef.current.search = nextSearch;
    }
  }, [searchParams]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          fetchProducts(page + 1);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchProducts, hasMore, isLoading, isLoadingMore, page]);

  return (
    <Layout>
      <div className="section-container py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-poppins font-bold text-2xl text-navy">Shop All Products</h1>
            <p className="text-gray-400 text-sm mt-1">{totalCount} products found</p>
        </div>

        <div className="flex gap-7 items-start">
          {/* ── Desktop Sidebar ── */}
          <div className="hidden lg:block w-64 shrink-0">
              <FilterPanel filters={filters} onChange={setFilters} onReset={handleReset} categories={categories} />
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
                    {activeCategoryLabel}
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
            {isLoading && products.length === 0 ? (
              <ProductGrid products={[]} isLoading />
            ) : error ? (
              <EmptyState
                title="Unable to load products"
                description={error}
                actionLabel="Try Again"
                onAction={() => fetchProducts(1, true)}
              />
            ) : products.length > 0 ? (
              <>
                <ProductGrid products={products} isLoading={isLoading && products.length === 0} />
                {isLoadingMore && (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    <SkeletonLoader variant="card" count={4} />
                  </div>
                )}
                <div ref={loadMoreRef} className="h-8" />
                {!hasMore && products.length > 0 && (
                  <p className="text-center text-xs text-gray-400 mt-4">You have reached the end.</p>
                )}
              </>
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
        categories={categories}
      />
    </Layout>
  );
};

export default Shop;
