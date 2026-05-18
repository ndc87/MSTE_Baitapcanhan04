import React from 'react';
import ProductCard from './ProductCard';
import SkeletonLoader from '../ui/SkeletonLoader';

const ProductGrid = ({ products, isLoading, columns = 'default' }) => {
  const gridClass = columns === 'default'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
    : `grid ${columns} gap-5`;

  if (isLoading) {
    return (
      <div className={gridClass}>
        <SkeletonLoader variant="card" count={8} />
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
