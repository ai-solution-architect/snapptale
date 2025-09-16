import { useState, useEffect } from 'react';

export function useFilePreview(file: File | null) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewSrc(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewSrc(objectUrl);

    // Clean up URL object when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return previewSrc;
}
