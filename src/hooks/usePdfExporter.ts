import { useState } from 'react';

export const usePdfExporter = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportPdf = async () => {
    // Logic will go here in the next cycle
  };

  return { isExporting, error, exportPdf };
};
