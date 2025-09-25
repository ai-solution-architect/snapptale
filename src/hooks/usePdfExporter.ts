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

// Helper function to get image dimensions from a base64 string
const getImageDimensions = (base64: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = base64;
  });
};


export const usePdfExporter = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportPdf = async (story: StoryChapter[], childName?: string) => {
    if (!story || story.length === 0) return;

    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 10;
      const contentWidth = pdf.internal.pageSize.getWidth() - margin * 2;

      for (const chapter of story) {
        pdf.setFontSize(16);
        pdf.text(chapter.title, margin, 20);

        let imageBlockHeight = 0;
        if (chapter.imageData) {
          // Extract base64 data and format from the imageData
          let base64Image = '';
          let imageFormat = 'PNG';
          let fullBase64 = '';
          
          if (chapter.imageData.startsWith('data:')) {
            // imageData already includes the data URL prefix
            const parts = chapter.imageData.split(',');
            if (parts.length === 2) {
              fullBase64 = chapter.imageData;
              base64Image = parts[1];
              const mimeType = parts[0].split(':')[1].split(';')[0];
              imageFormat = mimeType.split('/')[1].toUpperCase();
            }
          } else {
            // imageData is just base64, use mimeType or default to PNG
            base64Image = chapter.imageData;
            const mimeType = chapter.mimeType || 'image/png';
            imageFormat = mimeType.split('/')[1].toUpperCase();
            fullBase64 = `data:${mimeType};base64,${base64Image}`;
          }

          if (base64Image) {
            try {
              const { width: originalWidth, height: originalHeight } = await getImageDimensions(fullBase64);
              const aspectRatio = originalWidth / originalHeight;
              
              const maxImageHeight = (pdf.internal.pageSize.getHeight() - margin * 2) * 0.4;
              let imgWidth = contentWidth;
              let imgHeight = imgWidth / aspectRatio;

              if (imgHeight > maxImageHeight) {
                imgHeight = maxImageHeight;
                imgWidth = imgHeight * aspectRatio;
              }

              const xOffset = margin + (contentWidth - imgWidth) / 2;
              pdf.addImage(base64Image, imageFormat, xOffset, 30, imgWidth, imgHeight);
              imageBlockHeight = imgHeight;
            } catch (e) {
                console.error("Error loading image for PDF:", e);
            }
          } else {
            console.warn('Invalid imageData format for chapter:', chapter.chapter);
          }
        }

        const textY = 30 + imageBlockHeight + 10; // 10mm margin below image
        pdf.setFontSize(12);
        const splitText = pdf.splitTextToSize(chapter.text, contentWidth);
        pdf.text(splitText, margin, textY);

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