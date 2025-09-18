import { renderHook } from '@testing-library/react';
import { usePdfExporter } from '@/hooks/usePdfExporter';

describe('usePdfExporter', () => {
  it('should return the initial state', () => {
    const { result } = renderHook(() => usePdfExporter());

    expect(result.current.isExporting).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.exportPdf).toBe('function');
  });
});
