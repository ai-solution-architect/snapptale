import React from 'react';

interface StoryChapter {
  chapter: number;
  title: string;
  text: string;
  imageData?: string;
  mimeType?: string;
}

interface StorybookPreviewProps {
  story: StoryChapter[];
  onExport: () => void;
  isExporting: boolean;
}

// Function to convert markdown-style bold text to HTML bold tags
const formatText = (text: string): React.ReactNode[] => {
  if (!text) return [];
  
  // Split text by markdown bold pattern (**text**)
  const parts = text.split(/\*\*(.*?)\*\*/);
  
  return parts.map((part, index) => {
    // Odd indices are the bold text (captured groups)
    if (index % 2 === 1) {
      return <strong key={index}>{part}</strong>;
    }
    return part;
  });
};

const StorybookPreview: React.FC<StorybookPreviewProps> = ({ story, onExport, isExporting }) => {
  return (
    <div>
      {story.map((chapter) => (
        <div key={chapter.chapter} className="mb-8">
          <h2 className="text-xl font-bold text-snaptale-highlight mb-2">Chapter {chapter.chapter}: {chapter.title}</h2>
          {chapter.imageData && (
            <img
              src={chapter.imageData.startsWith('data:') ? chapter.imageData : `data:${chapter.mimeType || 'image/png'};base64,${chapter.imageData}`}
              alt={`Illustration for Chapter ${chapter.chapter}`}
              style={{ maxWidth: '100%', height: 'auto' }}
              className="mb-4"
            />
          )}
          <p className="text-snaptale-shadow">{formatText(chapter.text)}</p>
        </div>
      ))}
      <hr className="my-4 border-gray-300" /> {/* Added line */}
      <button onClick={onExport} disabled={isExporting} className="font-bold">
        {isExporting ? 'Preparing PDF...' : 'Download your Tale'}
      </button>
    </div>
  );
};

export default StorybookPreview;