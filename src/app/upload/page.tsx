'use client';

import { useState } from 'react';
import { useFilePreview } from '@/hooks/useFilePreview';
import Image from 'next/image';
import StorybookPreview from '@/components/StorybookPreview';
import { usePdfExporter } from '@/hooks/usePdfExporter';

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

  const { isExporting: isPdfExporting, error: pdfExportError, exportPdf: exportPdfHook } = usePdfExporter();

  const preview = useFilePreview(file);

  const handleClearPreview = () => {
    setFile(null);
  };

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
        }
        catch (jsonError) {
          errorMessage = 'An unexpected error occurred on the server.';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setStory(data.story);
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleExportPdf = async () => {
    if (!story || story.length === 0) return;
    await exportPdfHook(story, name);
  };

  return (
    <div className="min-h-screen bg-snaptale-app-background flex flex-col items-center justify-center p-4">
      <Image src="/Snaptale-Logo.png" alt="Snapptale Logo" width={200} height={50} className="w-32 md:w-48 h-auto mb-8" />

      <form onSubmit={handleSubmit} className="bg-snaptale-background p-4 sm:p-8 rounded-lg shadow-md w-full max-w-md mb-8">
        <div className="mb-4">
          <label htmlFor="photo-upload" className="block text-snaptale-shadow text-sm md:text-base font-bold mb-2 font-nunito">
            Upload Photo:
          </label>
          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-sm md:text-base text-snaptale-shadow leading-tight focus:outline-none focus:shadow-outline font-nunito"
          />
          {preview && (
            <div className="mt-4 relative w-32 h-32">
              {preview && <Image src={preview} alt="Preview" fill className="rounded object-cover" />} 
              <button
                type="button"
                onClick={handleClearPreview} 
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                X
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="child-name" className="block text-snaptale-shadow text-sm md:text-base font-bold mb-2 font-nunito">
            Child's Name:
          </label>
          <input
            type="text"
            id="child-name"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter child's name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-sm md:text-base text-snaptale-shadow leading-tight focus:outline-none focus:shadow-outline font-nunito"
          />
        </div>

        <button
          type="submit"
          className="bg-snaptale-highlight hover:bg-snaptale-shadow text-snaptale-shadow font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full font-poppins"
          disabled={isLoading || !file || !name}
        >
          {isLoading ? 'Generating Story...' : 'Generate Story'}
        </button>
      </form>

      {(error || pdfExportError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full max-w-md mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error || pdfExportError}</span>
        </div>
      )}

      {story.length > 0 && (
        <div className="bg-snaptale-background p-4 sm:p-8 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-snaptale-highlight mb-4 font-poppins">Your Snapptale Story</h2>
          <StorybookPreview story={story} onExport={handleExportPdf} isExporting={isPdfExporting} /> 
        </div>
      )
}
    </div>
  );
}