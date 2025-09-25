'use client';

import { useState, useRef, useEffect } from 'react';
import { useFilePreview } from '@/hooks/useFilePreview';
import Image from 'next/image';
import StorybookPreview from '@/components/StorybookPreview';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
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

  const storyRef = useRef<HTMLDivElement>(null); // Ref for the story section

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
      console.log('Received data from API:', JSON.stringify(data, null, 2)); // Debug log
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

  // Auto-scroll to story section when story is generated
  useEffect(() => {
    if (story.length > 0 && storyRef.current) {
      storyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [story]);

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      <Header title="Upload Photo" showBackButton={true} />
      <main className="flex-grow overflow-y-auto pb-24">
        <div className="px-4 pb-8 pt-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Your Story, Your Adventure
          </h2>
          
          <div className="mb-6">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center">
              {preview ? (
                <>
                  <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${preview})` }}
                  ></div>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <button 
                    className="relative z-10 flex flex-col items-center justify-center text-white bg-black/30 backdrop-blur-sm p-4 rounded-xl"
                    onClick={handleClearPreview}
                  >
                    <Icon name="photo_camera" size="lg" />
                    <span className="mt-2 text-sm font-semibold">Change Photo</span>
                  </button>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                  <Icon name="photo_camera" size="lg" className="text-gray-500" />
                  <span className="mt-2 text-sm font-semibold text-gray-500">Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="mb-6">
            <Input
              label="Child's Name"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter name here"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !file || !name}
            variant="primary"
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <Icon name="auto_awesome" className="animate-spin" />
                <span>Generating Story...</span>
              </span>
            ) : (
              'Generate Story'
            )}
          </Button>
        </div>

        {(error || pdfExportError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full max-w-md mb-4 mx-4" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error || pdfExportError}</span>
          </div>
        )}

        {story.length > 0 && (
          <div ref={storyRef} className="bg-background-light p-4 rounded-lg w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 text-center">
              Your Snaptale Story
            </h2>
            <StorybookPreview story={story} onExport={handleExportPdf} isExporting={isPdfExporting} /> 
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}