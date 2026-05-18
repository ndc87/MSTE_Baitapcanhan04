import React from 'react';

/**
 * SkeletonLoader
 * variant: 'card' | 'list' | 'detail' | 'text'
 */
const SkeletonBox = ({ className = '' }) => (
  <div className={`skeleton rounded-lg ${className}`} />
);

const CardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
    <SkeletonBox className="aspect-square w-full rounded-none" />
    <div className="p-4 space-y-3">
      <SkeletonBox className="h-4 w-3/4" />
      <SkeletonBox className="h-3 w-1/2" />
      <div className="flex items-center justify-between pt-1">
        <SkeletonBox className="h-5 w-20" />
        <SkeletonBox className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  </div>
);

const ListSkeleton = () => (
  <div className="flex gap-4 bg-white p-4 rounded-2xl" style={{ boxShadow: 'var(--shadow-card)' }}>
    <SkeletonBox className="w-20 h-20 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2.5 py-1">
      <SkeletonBox className="h-4 w-3/4" />
      <SkeletonBox className="h-3 w-1/2" />
      <SkeletonBox className="h-4 w-24" />
    </div>
  </div>
);

const TextSkeleton = ({ lines = 3 }) => (
  <div className="space-y-2.5">
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBox
        key={i}
        className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
      />
    ))}
  </div>
);

const SkeletonLoader = ({ variant = 'card', count = 1 }) => {
  const Component = variant === 'list' ? ListSkeleton : variant === 'text' ? () => <TextSkeleton /> : CardSkeleton;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </>
  );
};

export default SkeletonLoader;
