'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function ProfilePage() {
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex.johnson@example.com');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // In a real app, you would save to a database here
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header title="Profile" />
      <main className="flex-grow overflow-y-auto pb-24">
        <div className="px-4 pb-8 pt-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Account Settings
          </h2>
          
          <Card className="p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mr-4">
                AJ
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  {name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Free Account
                </p>
              </div>
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex space-x-3 pt-2">
                  <Button 
                    variant="secondary" 
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleSave}
                    className="flex-1"
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Name</p>
                  <p className="text-slate-900 dark:text-white">{name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                  <p className="text-slate-900 dark:text-white">{email}</p>
                </div>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-4"
                >
                  Edit Profile
                </Button>
              </div>
            )}
          </Card>
          
          <Card className="p-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
              App Settings
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Enable dark theme
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Notifications</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Receive story updates
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}