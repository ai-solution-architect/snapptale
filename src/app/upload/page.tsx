'use client'; // Needed to enable client-side interactivity in Next.js App Router

import React, { useState, useEffect } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  // Update preview URL when file changes
  useEffect(() => {
    if (!file) {
      setPreviewSrc(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewSrc(objectUrl);

    // Clean up URL object when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // Handler for file input changes
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8'>
      <h1 className='text-4xl font-bold mb-6'>Upload Photo</h1>

      {/* File Input */}
      <label htmlFor='file-input' className='sr-only'>Choose file</label>
      <input
        id='file-input'
        type='file'
        accept='image/*'
        onChange={onFileChange}
        aria-label='Choose file'
        data-testid='file-input'
        className='border border-gray-400 p-2 rounded mb-6'
      />

      {/* Image Preview */}
      {previewSrc && (
        <div className='mb-6 border border-gray-300 p-2 rounded max-w-xs'>
          <img src={previewSrc} alt='Preview' className='max-w-full h-auto rounded' />
        </div>
      )}

      {/* Next Button */}
      <button
        disabled={!file}
        className={`px-6 py-3 rounded text-white transition ${
          file
            ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Next
      </button>
    </main>
  );
}
