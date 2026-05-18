import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import SkeletonLoader from '../ui/SkeletonLoader';

const HorizontalProductCarousel = ({ title, products, isLoading, emptyMessage }) => {
  const containerRef = useRef(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const updatePageCount = () => {
    const el = containerRef.current;
    if (!el) return;
    const total = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth));
    setPageCount(total);
    setPage((prev) => Math.min(prev, total - 1));
  };

  useEffect(() => {
    updatePageCount();
    window.addEventListener('resize', updatePageCount);
    return () => window.removeEventListener('resize', updatePageCount);
  }, [products.length]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const current = Math.round(el.scrollLeft / el.clientWidth);
    setPage(current);
  };

  const scrollToPage = (nextPage) => {
    const el = containerRef.current;
    if (!el) return;
    const target = Math.min(Math.max(nextPage, 0), pageCount - 1);
    el.scrollTo({ left: target * el.clientWidth, behavior: 'smooth' });
    setPage(target);
  };

  const canPrev = page > 0;
  const canNext = page < pageCount - 1;

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="section-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title text-xl">{title}</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToPage(page - 1)}
              disabled={!canPrev}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-navy hover:border-navy transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous products"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollToPage(page + 1)}
              disabled={!canNext}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-navy hover:border-navy transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next products"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            <SkeletonLoader variant="card" count={4} />
          </div>
        ) : products.length > 0 ? (
          <>
            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
            >
              {products.map((product) => (
                <div key={product.id} className="min-w-[220px] sm:min-w-[240px] lg:min-w-[280px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            {pageCount > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: pageCount }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => scrollToPage(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      page === index ? 'w-6 bg-primary-500' : 'w-2.5 bg-gray-200 hover:bg-gray-300'
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-400 text-sm">{emptyMessage}</p>
        )}
      </div>
    </section>
  );
};

export default HorizontalProductCarousel;
