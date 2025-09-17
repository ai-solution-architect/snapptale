import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import UploadPage from '@/app/upload/page';

// Mock the useFilePreview hook
jest.mock('@/hooks/useFilePreview', () => ({
  useFilePreview: jest.fn(() => ({
    preview: null,
    clearPreview: jest.fn(),
  })),
}));

describe('Upload Page', () => {
    it('renders main heading and disabled generate story button', () => {
        render(<UploadPage />);
        expect(screen.getByRole('heading', { name: /snapptale/i })).toBeInTheDocument();
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
            expect(screen.getByText(/your snapptale story/i)).toBeInTheDocument()
        );
        expect(screen.getByText(/chapter 1: the beginning/i)).toBeInTheDocument();
        expect(screen.getByText(/a simple story chapter./i)).toBeInTheDocument();
        expect(screen.getByAltText(/illustration for chapter 1/i)).toBeInTheDocument();
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
});