'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';

interface Tale {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
}

export default function MyTalesPage() {
  const [tales] = useState<Tale[]>([
    {
      id: '1',
      title: 'The Adventure of Max',
      date: '2023-05-15',
      imageUrl: '/placeholder-image.jpg',
    },
    {
      id: '2',
      title: 'Luna and the Magic Garden',
      date: '2023-05-10',
      imageUrl: '/placeholder-image.jpg',
    },
    {
      id: '3',
      title: 'The Brave Little Elephant',
      date: '2023-05-05',
      imageUrl: '/placeholder-image.jpg',
    },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header title="My Tales" />
      <main className="flex-grow overflow-y-auto pb-24">
        <div className="px-4 pb-8 pt-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Your Story Collection
          </h2>
          
          {tales.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                You haven't created any stories yet.
              </p>
              <Link href="/upload" className="text-primary font-medium hover:underline">
                Create your first story
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {tales.map((tale) => (
                <Card key={tale.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-1/3 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Icon name="book" size="lg" className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="w-2/3 p-4">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                        {tale.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                        {tale.date}
                      </p>
                      <Link 
                        href={`/tale/${tale.id}`} 
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        Read Story
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}