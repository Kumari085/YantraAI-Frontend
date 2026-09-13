import React from 'react';
import clsx from 'clsx';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    xs: 'w-3 h-3 border',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2',
  };

  return (
    <div
      className={clsx(
        'rounded-full border-t-transparent border-sky-400 animate-spin flex-shrink-0',
        sizeMap[size] || sizeMap.md,
        className
      )}
    />
  );
};

export default LoadingSpinner;
