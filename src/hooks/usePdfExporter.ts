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

  const exportPdf = async (story: StoryChapter[], childName?: string) => {
    if (!story || story.length === 0) return;

    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      console.log('PDF object:', pdf);
      const margin = 10;
      const contentWidth = pdf.internal.pageSize.getWidth() - margin * 2;

      for (const chapter of story) {
        pdf.setFontSize(16);
        pdf.text(chapter.title, margin, 20);

        if (chapter.imageData && chapter.mimeType) {
          const parts = chapter.imageData.split(',');
          if (parts.length === 2) {
            const base64Image = parts[1]; // Get base64 part
            const imageFormat = chapter.mimeType.split('/')[1].toUpperCase(); // Get format (PNG, JPEG)

            // Calculate image dimensions to fit contentWidth
            // For simplicity, let's assume a fixed height for now or calculate aspect ratio if original dimensions are available
            const imgWidth = contentWidth; // Use full content width
            const imgHeight = (pdf.internal.pageSize.getHeight() / 3); // Example: 1/3rd of page height

            pdf.addImage(base64Image, imageFormat, margin, 30, imgWidth, imgHeight);
          } else {
            console.warn('Invalid imageData format for chapter:', chapter.chapter);
          }
        }

        pdf.setFontSize(12);
        const splitText = pdf.splitTextToSize(chapter.text, contentWidth);
        pdf.text(splitText, margin, 150); // Position text below image

        if (story.indexOf(chapter) < story.length - 1) {
          pdf.addPage();
        }
      }

      const fileName = `snapptale-${childName || 'story'}.pdf`;
      console.log('Attempting to save PDF:', fileName);
      pdf.save(fileName);
      console.log('PDF save function called.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, error, exportPdf };
};
