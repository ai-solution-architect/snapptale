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
}

const StorybookPreview: React.FC<StorybookPreviewProps> = ({ story }) => {
  return (
    <div>
      {story.map((chapter) => (
        <div key={chapter.chapter}>
          <h2>Chapter {chapter.chapter}: {chapter.title}</h2>
          <p>{chapter.text}</p>
        </div>
      ))}
    </div>
  );
};

export default StorybookPreview;
