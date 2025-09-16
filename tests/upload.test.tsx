import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
});
