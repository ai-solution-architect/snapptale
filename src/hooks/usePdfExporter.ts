import { useState } from 'react';

export const usePdfExporter = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportPdf = async () => {
    setIsExporting(true);
    try {
      // Mock async work for the test
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (e) {
      // Error handling will be tested in a later cycle
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, error, exportPdf };
};
