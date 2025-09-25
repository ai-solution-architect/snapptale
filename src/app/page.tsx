'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow overflow-y-auto pb-24">
        <div className="px-4 pb-8 pt-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Your Story, Your Adventure
          </h2>
          <div className="flex justify-center mb-8">
            <Image 
              src="/Snaptale-Logo.png" 
              alt="Snaptale Logo" 
              width={200} 
              height={50} 
              className="w-48 md:w-64 h-auto" 
            />
          </div>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-8">
            Upload a photo to start your personalized storybook journey.
          </p>
          <Link href='/upload' className="block">
            <Button variant="primary" className="w-full">
              Go to Upload
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}