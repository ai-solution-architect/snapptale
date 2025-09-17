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
        <div key={chapter.chapter}>
          <h2>Chapter {chapter.chapter}: {chapter.title}</h2>
          <p>{chapter.text}</p>
          {chapter.imageData && chapter.mimeType && (
            <img
              src={chapter.imageData}
              alt={`Illustration for Chapter ${chapter.chapter}`}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          )}
        </div>
      ))}
      <button onClick={onExport} disabled={isExporting}>
        {isExporting ? 'Preparing PDF...' : 'Export PDF'}
      </button>
    </div>
  );
};

export default StorybookPreview;