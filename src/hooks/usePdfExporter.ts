import { useState } from 'react';
import jsPDF from 'jspdf';

// Define a type for the story chapter to be used in the hook
interface StoryChapter {
  chapter: number;
  title: string;
  text: string;
  imageData?: string;
  mimeType?: string;
}

export const usePdfExporter = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportPdf = async (story: StoryChapter[]) => {
    if (!story || story.length === 0) return;

    setIsExporting(true);
    try {
      // Simulate async work to allow state changes to be tested
      await new Promise(resolve => setTimeout(resolve, 0));

      const pdf = new jsPDF();

      story.forEach((chapter, index) => {
        if (index > 0) {
          pdf.addPage();
        }
        // Simple positioning for now, will be refined later.
        pdf.text(chapter.title, 10, 20);
        pdf.text(chapter.text, 10, 30);
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, error, exportPdf };
};
