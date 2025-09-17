'use client';

import { useState } from 'react';
import { useFilePreview } from '@/hooks/useFilePreview';
import Image from 'next/image';
import StorybookPreview from '@/components/StorybookPreview'; // Import the new component

interface StoryChapter {
  chapter: number;
  title: string;
  text: string;
  imageData?: string;
  mimeType?: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [story, setStory] = useState<StoryChapter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { preview, clearPreview } = useFilePreview(file);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !name) {
      setError('Please upload a photo and enter a name.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStory([]);

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('name', name);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to generate story.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If response is not JSON, use a generic error message
          errorMessage = 'An unexpected error occurred on the server.';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setStory(data.story);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Snapptale</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-8">
        <div className="mb-4">
          <label htmlFor="photo-upload" className="block text-gray-700 text-sm font-bold mb-2">
            Upload Photo:
          </label>
          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {preview && (
            <div className="mt-4 relative w-32 h-32">
              <Image src={preview} alt="Preview" layout="fill" objectFit="cover" className="rounded" />
              <button
                type="button"
                onClick={clearPreview}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                X
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="child-name" className="block text-gray-700 text-sm font-bold mb-2">
            Child's Name:
          </label>
          <input
            type="text"
            id="child-name"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter child's name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          disabled={isLoading || !file || !name}
        >
          {isLoading ? 'Generating Story...' : 'Generate Story'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full max-w-md mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {story.length > 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Your Snapptale Story</h2>
          <StorybookPreview story={story} /> {/* Use the new component here */}
        </div>
      )}
    </div>
  );
}