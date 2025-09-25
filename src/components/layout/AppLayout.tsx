import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  title, 
  showBackButton = false, 
  onBack 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header 
        title={title} 
        showBackButton={showBackButton} 
        onBack={onBack} 
      />
      <main className="flex-grow pb-24 pt-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;