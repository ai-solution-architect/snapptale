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

const StorybookPreview: React.FC<StorybookPreviewProps> = ({ story, onExport, isExporting }) => {
  return (
    <div>
      {story.map((chapter) => (
        <div key={chapter.chapter} className="mb-8">
          <h2 className="text-xl font-bold text-snaptale-highlight mb-2">Chapter {chapter.chapter}: {chapter.title}</h2>
          <p className="text-snaptale-shadow mb-4">{chapter.text}</p>
          {chapter.imageData && chapter.mimeType && (
            <img
              src={`data:${chapter.mimeType};base64,${chapter.imageData}`}
              alt={`Illustration for Chapter ${chapter.chapter}`}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          )}
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