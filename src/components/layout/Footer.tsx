import React from 'react';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="flex justify-around p-2">
        <Link 
          href="/" 
          className="flex flex-col items-center justify-center gap-1 text-primary w-1/3 p-2 rounded-full bg-primary/10"
          aria-current="page"
        >
          <Icon name="home" size="md" fill={true} />
          <span className="text-xs font-bold">Home</span>
        </Link>
        <Link 
          href="/my-tales" 
          className="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400 w-1/3"
        >
          <Icon name="book" size="md" />
          <span className="text-xs font-medium">My Tales</span>
        </Link>
        <Link 
          href="/profile" 
          className="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400 w-1/3"
        >
          <Icon name="person" size="md" />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;