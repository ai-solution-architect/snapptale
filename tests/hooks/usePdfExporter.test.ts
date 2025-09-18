import { renderHook, act, waitFor } from '@testing-library/react';
import { usePdfExporter } from '@/hooks/usePdfExporter';
import jsPDF from 'jspdf';

// Mock the jspdf library
jest.mock('jspdf');

describe('usePdfExporter', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    (jsPDF as jest.Mock).mockClear();
  });

  it('should return the initial state', () => {
    const { result } = renderHook(() => usePdfExporter());

    expect(result.current.isExporting).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.exportPdf).toBe('function');
  });

  it('should set isExporting to true during the export process', async () => {
    const { result } = renderHook(() => usePdfExporter());

    // Kick off the async function
    act(() => {
      result.current.exportPdf([{ chapter: 1, title: 't', text: 't' }]);
    });

    // Wait for the `isExporting` state to become true
    await waitFor(() => {
      expect(result.current.isExporting).toBe(true);
    });

    // Wait for the export to finish and the state to become false again
    await waitFor(() => {
      expect(result.current.isExporting).toBe(false);
    });
  });

  it('should call jspdf with the correct text content', async () => {
    const mockPdf = {
      text: jest.fn(),
      addPage: jest.fn(),
    };
    (jsPDF as jest.Mock).mockImplementation(() => mockPdf);

    const { result } = renderHook(() => usePdfExporter());
    const mockStory = [
      { chapter: 1, title: 'Chapter 1', text: 'Once upon a time...' },
      { chapter: 2, title: 'Chapter 2', text: 'The adventure begins.' },
    ];

    await act(async () => {
      await result.current.exportPdf(mockStory);
    });

    expect(jsPDF).toHaveBeenCalledTimes(1);
    expect(mockPdf.text).toHaveBeenCalledWith(
      'Chapter 1',
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPdf.text).toHaveBeenCalledWith(
      'Once upon a time...',
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPdf.addPage).toHaveBeenCalledTimes(1);
    expect(mockPdf.text).toHaveBeenCalledWith(
      'Chapter 2',
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPdf.text).toHaveBeenCalledWith(
      'The adventure begins.',
      expect.any(Number),
      expect.any(Number)
    );
  });
});
