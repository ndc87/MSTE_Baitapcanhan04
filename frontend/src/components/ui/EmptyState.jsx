import React from 'react';
import { Package } from 'lucide-react';
import CTAButton from './CTAButton';

const EmptyState = ({
  icon: Icon = Package,
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
        <Icon size={28} className="text-gray-300" />
      </div>
      <h3 className="font-poppins font-semibold text-lg text-navy mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <div className="mt-6">
          <CTAButton onClick={onAction} size="md">{actionLabel}</CTAButton>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
