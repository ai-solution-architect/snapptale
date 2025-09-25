import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`rounded-xl bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default Card;