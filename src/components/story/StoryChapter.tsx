import React from 'react';
import Card from '@/components/ui/Card';

interface StoryChapterProps {
  chapterNumber: number;
  title: string;
  content: string;
  imageUrl?: string;
}

const StoryChapter: React.FC<StoryChapterProps> = ({ 
  chapterNumber, 
  title, 
  content, 
  imageUrl 
}) => {
  return (
    <Card className="mb-6 overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Chapter {chapterNumber}: {title}
        </h3>
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={`Illustration for chapter ${chapterNumber}`}
            className="w-full rounded-lg aspect-[4/3] object-cover mb-4"
          />
        )}
        <p className="text-base leading-relaxed text-slate-700">
          {content}
        </p>
      </div>
    </Card>
  );
};

export default StoryChapter;