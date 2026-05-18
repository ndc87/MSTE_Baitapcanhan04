import React from 'react';
import { Star } from 'lucide-react';

/**
 * StarRating
 * mode: 'display' (read-only) | 'input' (clickable)
 */
const StarRating = ({
  rating = 0,
  reviewCount,
  mode = 'display',
  onRate,
  size = 14,
  className = '',
}) => {
  const [hovered, setHovered] = React.useState(0);
  const display = mode === 'input' ? (hovered || rating) : rating;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = display >= star;
          const half   = !filled && display >= star - 0.5;

          return (
            <button
              key={star}
              type="button"
              onClick={mode === 'input' ? () => onRate?.(star) : undefined}
              onMouseEnter={mode === 'input' ? () => setHovered(star) : undefined}
              onMouseLeave={mode === 'input' ? () => setHovered(0) : undefined}
              disabled={mode === 'display'}
              aria-label={`${star} star`}
              className={mode === 'input' ? 'cursor-pointer' : 'cursor-default pointer-events-none'}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              <Star
                size={size}
                className={
                  filled
                    ? 'text-amber-400 fill-amber-400'
                    : half
                    ? 'text-amber-400 fill-amber-200'
                    : 'text-gray-200 fill-gray-200'
                }
              />
            </button>
          );
        })}
      </div>

      {reviewCount !== undefined && (
        <span className="text-gray-400 text-xs font-inter">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default StarRating;
