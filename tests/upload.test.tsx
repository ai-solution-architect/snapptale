import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import UploadPage from '@/app/upload/page';

describe('Upload Page', () => {
  it('renders upload heading and disabled controls', () => {
    render(<UploadPage />);
    expect(screen.getByRole('heading', { name: /upload photo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('enables Next button and shows preview on valid image selection', async () => {
    render(<UploadPage />);
    const input = screen.getByLabelText(/choose file/i) || screen.getByTestId('file-input');
    const button = screen.getByRole('button', { name: /next/i, });
    
    // Create a mock file (PNG image)
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    // Mock the input's files property and trigger change
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });
    fireEvent.change(input);

    await waitFor(() => expect(button).toBeEnabled());
    expect(screen.getByAltText(/preview/i)).toBeInTheDocument();
  });

  it('uploads an image and displays the NanoBanana AI generated illustration', async () => {
    // Arrange
    render(<UploadPage />);
    const input = screen.getByLabelText(/choose file/i) || screen.getByTestId('file-input');
    const button = screen.getByRole('button', { name: /next/i });

    // Mock the file and server responses
    const file = new File(['(image-content)'], 'child.png', { type: 'image/png' });

    // Act
    await act(async () => { // Wrap in act
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });
      fireEvent.change(input);
      await waitFor(() => expect(button).toBeEnabled()); // Wait for button to be enabled
      fireEvent.click(button);
    });

    // Assert: Wait for the mocked AI illustration or result
    await waitFor(() =>
      expect(screen.getByAltText(/ai-generated illustration/i)).toBeInTheDocument()
    );
    expect(screen.getByAltText(/ai-generated illustration/i).src).toContain('data:image/png;base64,');
  });

  it('calls the /api/upload endpoint with the correct data when Next button is clicked', async () => {
    // Arrange
    render(<UploadPage />);
    const input = screen.getByLabelText(/choose file/i) || screen.getByTestId('file-input');
    const button = screen.getByRole('button', { name: /next/i });

    const file = new File(['(image-content)'], 'child.png', { type: 'image/png' });

    // Act
    await act(async () => { // Wrap in act
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });
      fireEvent.change(input);

      // Wait for the button to be enabled before clicking
      await waitFor(() => expect(button).toBeEnabled());
      fireEvent.click(button);
    });

    // Assert
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/upload', expect.objectContaining({
      method: 'POST',
      body: expect.any(FormData), // Assert that the body is an instance of FormData
    }));
  });

  it('shows a user-friendly error when the server returns a 500 status', async () => {
    // Arrange: Mock a 500 Internal Server Error response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        // Simulate the server sending HTML or a non-JSON response, causing .json() to fail
        json: () => Promise.reject(new SyntaxError('Unexpected token < in JSON at position 0')),
      })
    ) as jest.Mock;

    render(<UploadPage />);
    const input = screen.getByTestId('file-input');
    const button = screen.getByRole('button', { name: /next/i });
    const file = new File(['content'], 'image.png', { type: 'image/png' });

    // Act
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => expect(button).toBeEnabled());
    fireEvent.click(button);

    // Assert: Check for a generic, user-friendly error message
    await waitFor(() => {
      expect(screen.getByText(/upload failed. please try again./i)).toBeInTheDocument();
    });
  });
});
