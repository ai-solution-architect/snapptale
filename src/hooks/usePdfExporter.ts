import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

        if (chapter.imageData) {
          const imgElement = document.createElement('img');
          imgElement.src = chapter.imageData;
          const canvas = await html2canvas(imgElement);
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 100; // fixed width for now
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', margin, 30, imgWidth, imgHeight);
        }

        pdf.setFontSize(12);
        const splitText = pdf.splitTextToSize(chapter.text, contentWidth);
        pdf.text(splitText, margin, 150); // Position text below image

        if (story.indexOf(chapter) < story.length - 1) {
          pdf.addPage();
        }
      }

      const fileName = `snapptale-${childName || 'story'}.pdf`;
      pdf.save(fileName);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      console.error('--- Error in exportPdf try block ---', e);
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, error, exportPdf };
};
