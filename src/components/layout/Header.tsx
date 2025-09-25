import React from 'react';
import Icon from '@/components/ui/Icon';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'Snaptale', 
  showBackButton = false, 
  onBack 
}) => {
  return (
    <header className="sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-10">
      <div className="flex items-center p-4 justify-between">
        {showBackButton ? (
          <button 
            onClick={onBack}
            className="text-slate-800 dark:text-slate-200"
            aria-label="Go back"
          >
            <Icon name="arrow_back" size="md" />
          </button>
        ) : (
          <div className="w-6"></div>
        )}
        <h1 className="text-lg font-bold">{title}</h1>
        <div className="w-6"></div>
      </div>
    </header>
  );
};

export default Header;