import { renderHook, act } from '@testing-library/react';
import { usePdfExporter } from '@/hooks/usePdfExporter';

describe('usePdfExporter', () => {
  it('should return the initial state', () => {
    const { result } = renderHook(() => usePdfExporter());

    expect(result.current.isExporting).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.exportPdf).toBe('function');
  });

  it('should set isExporting to true during the export process', async () => {
    const { result } = renderHook(() => usePdfExporter());

    // Use `act` to wrap the call that causes a state update
    let exportPromise: Promise<void>;
    act(() => {
      exportPromise = result.current.exportPdf();
    });

    // Immediately after calling, isExporting should be true
    expect(result.current.isExporting).toBe(true);

    // Wait for the promise returned by exportPdf to resolve
    await act(async () => {
      await exportPromise;
    });

    // After completion, it should be false again
    expect(result.current.isExporting).toBe(false);
  });
});
