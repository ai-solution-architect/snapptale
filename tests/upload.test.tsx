import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import UploadPage from '@/app/upload/page';
import React from 'react';
import StorybookPreview from '@/components/StorybookPreview';
import { useFilePreview } from '@/hooks/useFilePreview';

// Mock the useFilePreview hook
jest.mock('@/hooks/useFilePreview', () => ({
  useFilePreview: jest.fn(() => null), // Mock to return null directly by default
}));

// Mock the StorybookPreview component
const mockOnExport = jest.fn(); // Define mockOnExport as a jest.fn() initially
let mockIsExporting = false; // Define mockIsExporting outside to be accessible
jest.mock('@/components/StorybookPreview', () => ({
  __esModule: true,
  default: jest.fn((props) => {
    // Update the external mock variables with the latest props
    mockOnExport.mockImplementation(props.onExport); // Set the implementation of our mock
    mockIsExporting = props.isExporting;
    return (
      <div data-testid="storybook-preview">
        Mock Storybook Preview
        <button onClick={() => mockOnExport(props.onExport)} disabled={props.isExporting}>
          {props.isExporting ? 'Preparing PDF...' : 'Export PDF'}
        </button>
      </div>
    );
  }),
}));

describe('Upload Page', () => {
    // Reset mocks before each test
    beforeEach(() => {
        mockOnExport.mockClear();
        mockIsExporting = false;
        (StorybookPreview as jest.Mock).mockClear();
    });

    it('should render without crashing when useFilePreview returns a non-object', () => {
        // Temporarily override the mock for this specific test
        // The hook now returns a string or null, not an object.
        // We want to ensure the component handles this gracefully.
        (useFilePreview as jest.Mock).mockReturnValueOnce(null);

        // Expect the component to render without throwing an error
        expect(() => render(<UploadPage />)).not.toThrow();
    });

    it('renders main heading and disabled generate story button', () => {
        render(<UploadPage />);
        expect(screen.getByRole('img', { name: /snapptale logo/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /generate story/i })).toBeDisabled();
    });

    it('enables Generate Story button on valid input', async () => {
        render(<UploadPage />);
        const nameInput = screen.getByLabelText(/child's name/i);
        const fileInput = screen.getByLabelText(/upload photo/i);
        const generateButton = screen.getByRole('button', { name: /generate story/i });

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });

        await act(async () => {
            const file = new File(['hello'], 'hello.png', { type: 'image/png' });
            Object.defineProperty(fileInput, 'files', {
                value: [file],
                writable: false,
            });
            fireEvent.change(fileInput);
        });

        await waitFor(() => expect(generateButton).toBeEnabled());
    });

    it('uploads an image and displays the AI generated story', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                story: [
                    {
                        chapter: 1,
                        title: 'The Beginning',
                        text: 'A simple story chapter.',
                        imageData: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // A 1x1 transparent PNG base64
                        mimeType: 'image/png',
                    }
                ]
            }),
        } as Response);

        render(<UploadPage />);
        const nameInput = screen.getByLabelText(/child's name/i);
        const fileInput = screen.getByLabelText(/upload photo/i);
        const generateButton = screen.getByRole('button', { name: /generate story/i });

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        const file = new File(['(image-content)'], 'child.png', { type: 'image/png' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        await act(async () => {
            fireEvent.click(generateButton);
        });

        await waitFor(() =>
            expect(screen.getByTestId('storybook-preview')).toBeInTheDocument()
        );
        // Removed assertions for chapter text/images as StorybookPreview is mocked
    });

    it('calls the /api/upload endpoint with the correct data', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ story: [] }),
        } as Response);

        render(<UploadPage />);
        const nameInput = screen.getByLabelText(/child's name/i);
        const fileInput = screen.getByLabelText(/upload photo/i);
        const generateButton = screen.getByRole('button', { name: /generate story/i });

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        const file = new File(['(image-content)'], 'child.png', { type: 'image/png' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        await act(async () => {
            fireEvent.click(generateButton);
        });

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith('/api/upload', expect.objectContaining({
            method: 'POST',
            body: expect.any(FormData),
        }));
    });

    it('shows a user-friendly error when the server returns a 500 status', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                json: () => Promise.reject(new SyntaxError('Unexpected token < in JSON at position 0')),
            })
        ) as jest.Mock;

        render(<UploadPage />);
        const nameInput = screen.getByLabelText(/child's name/i);
        const fileInput = screen.getByLabelText(/upload photo/i);
        const generateButton = screen.getByRole('button', { name: /generate story/i });

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        const file = new File(['content'], 'image.png', { type: 'image/png' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => expect(generateButton).toBeEnabled());
        await act(async () => {
            fireEvent.click(generateButton);
        });

        await waitFor(() => {
            expect(screen.getByText(/an unexpected error occurred on the server./i)).toBeInTheDocument();
        });
    });

    it('shows a loading message after clicking Generate Story, before results appear', async () => {
        global.fetch = jest.fn().mockResolvedValue(new Promise(() => { }));

        render(<UploadPage />);
        const nameInput = screen.getByLabelText(/child's name/i);
        const fileInput = screen.getByLabelText(/upload photo/i);
        const generateButton = screen.getByRole('button', { name: /generate story/i });

        fireEvent.change(nameInput, { target: { value: 'Bobby' } });
        fireEvent.change(fileInput, { target: { files: [new File(['x'], 'x.png', { type: 'image/png' })] } });

        await act(async () => {
            fireEvent.click(generateButton);
        });

        expect(screen.getByText(/generating story.../i)).toBeInTheDocument();
    });

    it('should call onExport when the Export PDF button is clicked', async () => {
        // Mock fetch to simulate a story being generated
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                story: [
                    {
                        chapter: 1, title: 'Test Chapter', text: 'Test text.',
                    },
                ],
            }),
        } as Response);

        render(<UploadPage />);

        // Simulate valid input and story generation
        const nameInput = screen.getByLabelText(/child's name/i);
        const fileInput = screen.getByLabelText(/upload photo/i);
        const generateButton = screen.getByRole('button', { name: /generate story/i });

        fireEvent.change(nameInput, { target: { value: 'Test Child' } });
        fireEvent.change(fileInput, { target: { files: [new File(['x'], 'x.png', { type: 'image/png' })] } });

        await act(async () => {
            fireEvent.click(generateButton);
        });

        // Wait for the StorybookPreview component to render
        await waitFor(() => {
            expect(screen.getByTestId('storybook-preview')).toBeInTheDocument();
        });

        // Now, find the Export PDF button within the mocked StorybookPreview and click it
        // This will trigger the onExport prop passed from UploadPage
        const exportPdfButton = screen.getByRole('button', { name: /export pdf/i });

        await act(async () => {
            fireEvent.click(exportPdfButton);
        });

        // Assert that onExport was called
        expect(mockOnExport).toHaveBeenCalledTimes(1);

        // Assert that isExporting changed to true
        // This will check the value updated by the mock itself
        expect(mockIsExporting).toBe(true);
    });
});