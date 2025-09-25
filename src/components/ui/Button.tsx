import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'flex items-center justify-center rounded-full font-bold transition-colors duration-200 h-12 px-6';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 disabled:bg-primary/50 disabled:opacity-50',
    secondary: 'bg-background-light dark:bg-background-dark text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 hover:bg-background-light/80 dark:hover:bg-background-dark/80 disabled:opacity-50',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;