import { renderHook, act, waitFor } from '@testing-library/react';
import { usePdfExporter } from '@/hooks/usePdfExporter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Mock the libraries (must be at the top)
jest.mock('jspdf', () => {
  const mockPdf = {
    text: jest.fn(),
    addPage: jest.fn(),
    addImage: jest.fn(),
    save: jest.fn(),
    setFontSize: jest.fn(),
    splitTextToSize: jest.fn((text) => [text]),
    internal: {
      pageSize: {
        getWidth: jest.fn(() => 210),
        getHeight: jest.fn(() => 297),
      },
    },
  };
  return jest.fn(() => mockPdf);
});
jest.mock('html2canvas');

describe('usePdfExporter', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    (jsPDF as jest.Mock).mockClear();
    (html2canvas as jest.Mock).mockClear();
  });

  it('should return the initial state', () => {
    const { result } = renderHook(() => usePdfExporter());

    expect(result.current.isExporting).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.exportPdf).toBe('function');
  });

  it('should set isExporting to true during the export process', async () => {
    const { result } = renderHook(() => usePdfExporter());

    act(() => {
      result.current.exportPdf([{ chapter: 1, title: 't', text: 't' }]);
    });

    await waitFor(() => {
      expect(result.current.isExporting).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isExporting).toBe(false);
    });
  });

  it('should call jspdf with the correct text content', async () => {
    const { result } = renderHook(() => usePdfExporter());
    const mockStory = [
      { chapter: 1, title: 'Chapter 1', text: 'Once upon a time...' },
      { chapter: 2, title: 'Chapter 2', text: 'The adventure begins.' },
    ];

    await act(async () => {
      await result.current.exportPdf(mockStory, 'test-child');
    });

    expect(jsPDF).toHaveBeenCalledTimes(1);
    expect(jsPDF().text).toHaveBeenCalledWith(
      'Chapter 1',
      expect.any(Number),
      expect.any(Number)
    );
    expect(jsPDF().text).toHaveBeenCalledWith(
      ['Once upon a time...'], // Expect an array here
      expect.any(Number),
      expect.any(Number)
    );
    expect(jsPDF().addPage).toHaveBeenCalledTimes(1);
    expect(jsPDF().text).toHaveBeenCalledWith(
      'Chapter 2',
      expect.any(Number),
      expect.any(Number)
    );
    expect(jsPDF().text).toHaveBeenCalledWith(
      ['The adventure begins.'], // Expect an array here
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('should handle images and save the PDF', async () => {
    (html2canvas as jest.Mock).mockResolvedValue({ toDataURL: () => 'data:image/png;base64,mock_image_data' });

    const { result } = renderHook(() => usePdfExporter());
    const mockStory = [
      { chapter: 1, title: 'C1', text: 'T1', imageData: 'base64_string_1' },
      { chapter: 2, title: 'C2', text: 'T2', imageData: 'base64_string_2' },
    ];
    const mockChildName = 'Alex';

    await act(async () => {
      await result.current.exportPdf(mockStory, mockChildName);
    });

    expect(html2canvas).toHaveBeenCalledTimes(2);
    expect(jsPDF().addImage).toHaveBeenCalledTimes(2);
    expect(jsPDF().save).toHaveBeenCalledWith('snapptale-Alex.pdf');
  });

  it('should call the save function with the correct filename', async () => {
    const { result } = renderHook(() => usePdfExporter());

    await act(async () => {
      await result.current.exportPdf([{ title: 't' }], 'TestName');
    });

    expect(jsPDF().save).toHaveBeenCalledWith('snapptale-TestName.pdf');
  });
});