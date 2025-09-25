import React from 'react';
import Icon from '@/components/ui/Icon';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center justify-center">
      <Icon 
        name="auto_awesome" 
        className={`animate-spin ${sizeClasses[size]}`} 
      />
    </div>
  );
};

export default LoadingSpinner;