import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false,
  className = '',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinner = (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 
          className={`${sizeClasses[size]} text-blue-600 animate-spin`} 
        />
        {showText && (
          <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

// Inline spinner for buttons and small spaces
export const InlineSpinner = ({ size = 'sm', className = '' }) => (
  <Loader2 
    className={`${
      size === 'xs' ? 'h-3 w-3' : 
      size === 'sm' ? 'h-4 w-4' : 
      size === 'md' ? 'h-5 w-5' : 'h-6 w-6'
    } animate-spin ${className}`} 
  />
);

// Skeleton loader for content placeholders
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  animate = true 
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 bg-gray-200 rounded ${
          animate ? 'animate-pulse' : ''
        } ${
          i === lines - 1 ? 'w-3/4' : 'w-full'
        }`}
      />
    ))}
  </div>
);

// Card skeleton for loading cards
export const CardSkeleton = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;