import React from 'react';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import StoryChapter from '@/components/story/StoryChapter';

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
        <StoryChapter
          key={chapter.chapter}
          chapterNumber={chapter.chapter}
          title={chapter.title}
          content={formatText(chapter.text) as string}
          imageUrl={chapter.imageData ? (chapter.imageData.startsWith('data:') ? chapter.imageData : `data:${chapter.mimeType || 'image/png'};base64,${chapter.imageData}`) : undefined}
        />
      ))}
      <div className="px-6 pt-10 pb-4">
        <Button onClick={onExport} disabled={isExporting} variant="primary">
          {isExporting ? (
            <span className="flex items-center justify-center space-x-2">
              <Icon name="auto_awesome" className="animate-spin" />
              <span>Preparing PDF...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <Icon name="download" />
              <span>Download PDF</span>
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default StorybookPreview;