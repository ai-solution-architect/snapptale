import { renderHook, act, waitFor } from '@testing-library/react';
import { usePdfExporter } from '@/hooks/usePdfExporter';
import jsPDF from 'jspdf';

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

// Refined Mock for window.Image
class MockImage {
  onload: () => void = () => {};
  onerror: (err: any) => void = () => {};
  src: string = '';
  width: number = 100;
  height: number = 100;

  constructor() {
    // Use a timeout to simulate async loading but resolve quickly
    setTimeout(() => this.onload(), 0);
    return this;
  }
}

beforeAll(() => {
  // @ts-ignore
  global.Image = MockImage;
});

afterAll(() => {
  // @ts-ignore
  delete global.Image;
});


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

    let exportPromise;
    act(() => {
      exportPromise = result.current.exportPdf([{ chapter: 1, title: 't', text: 't' }]);
    });

    await waitFor(() => expect(result.current.isExporting).toBe(true));

    await act(async () => {
      await exportPromise;
    });

    await waitFor(() => expect(result.current.isExporting).toBe(false));
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
    const { result } = renderHook(() => usePdfExporter());
    const mockStory = [
      { chapter: 1, title: 'C1', text: 'T1', imageData: 'data:image/png;base64,mock_image_data_1', mimeType: 'image/png' },
      { chapter: 2, title: 'C2', text: 'T2', imageData: 'data:image/jpeg;base64,mock_image_data_2', mimeType: 'image/jpeg' },
    ];
    const mockChildName = 'Alex';

    await act(async () => {
      await result.current.exportPdf(mockStory, mockChildName);
    });

    expect(jsPDF().addImage).toHaveBeenCalledTimes(2);
    expect(jsPDF().addImage).toHaveBeenCalledWith(
      'mock_image_data_1', 'PNG', expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number)
    );
    expect(jsPDF().addImage).toHaveBeenCalledWith(
      'mock_image_data_2', 'JPEG', expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number)
    );
    expect(jsPDF().save).toHaveBeenCalledWith('snapptale-Alex.pdf');
  });

  it('should call the save function with the correct filename', async () => {
    const { result } = renderHook(() => usePdfExporter());

    await act(async () => {
      await result.current.exportPdf([{ chapter: 1, title: 't', text: 't' }], 'TestName');
    });

    expect(jsPDF().save).toHaveBeenCalledWith('snapptale-TestName.pdf');
  });
});