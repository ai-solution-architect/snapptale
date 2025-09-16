'use client';

import React, { useState } from 'react';
import { useFilePreview } from '@/hooks/useFilePreview';

export default function UploadPage() {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [aiImgUrl, setAiImgUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Add error state

  const previewSrc = useFilePreview(file);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setAiImgUrl(null); // Clear previous result
      setError(null); // Clear previous error
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        // Try to parse a JSON error response, but fallback to a generic message
        try {
          const data = await res.json();
          throw new Error(data.error || 'Upload failed. Please try again.');
        } catch (jsonError) {
          throw new Error('Upload failed. Please try again.');
        }
      }

      const data = await res.json();

      if (data.imageData && data.mimeType) {
        const dataUri = `data:${data.mimeType};base64,${data.imageData}`;
        setAiImgUrl(dataUri);
      } else {
        throw new Error('Upload succeeded, but the response was invalid.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6">Upload Photo</h1>

      <div className="mb-6">
        <label htmlFor="name-input" className="block text-sm font-medium text-gray-700">Child's Name</label>
        <input
          id="name-input"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          aria-label="Child's Name"
          className="mt-1 block w-full border border-gray-400 p-2 rounded shadow-sm"
        />
      </div>
      <label htmlFor="file-input" className="sr-only">Choose file</label>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        aria-label="Choose file"
        data-testid="file-input"
        className="border border-gray-400 p-2 rounded mb-6"
      />

      {previewSrc && (
        <div className="mb-6 border border-gray-300 p-2 rounded max-w-xs">
          <img src={previewSrc} alt="Preview" className="max-w-full h-auto rounded" />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!name.trim() || !file || isUploading}
        className={`px-6 py-3 rounded text-white transition ${file && !isUploading
            ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            : 'bg-gray-400 cursor-not-allowed'
          }`}
      >
        {isUploading ? 'Uploading...' : 'Next'}
      </button>

      {error && (
        <div className="mt-4 text-red-600 font-bold">
          <p>{error}</p>
        </div>
      )}

      {aiImgUrl && (
        <div className="mt-4">
          <img
            src={aiImgUrl}
            alt="AI-generated illustration"
            className="max-w-full rounded"
          />
        </div>
      )}
    </main>
  );
}
