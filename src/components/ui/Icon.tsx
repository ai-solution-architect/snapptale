import React from 'react';

interface IconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  fill?: boolean;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 'md', 
  fill = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <span 
      className={`material-symbols-outlined ${fill ? 'fill' : ''} ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
};

export default Icon;