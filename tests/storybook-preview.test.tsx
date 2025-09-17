import { render, screen, fireEvent } from '@testing-library/react';
import StorybookPreview from '@/components/StorybookPreview';

const mockStory = [
  {
    chapter: 1,
    title: 'The Beginning',
    text: 'Once upon a time, in a land far away...',
    imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // A tiny transparent PNG
    mimeType: 'image/png',
  },
  {
    chapter: 2,
    title: 'The Adventure',
    text: 'Our hero embarked on a perilous journey...',
    imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // Another tiny transparent PNG
    mimeType: 'image/png',
  },
];

describe('StorybookPreview', () => {
  it('should render chapter titles and text', () => {
    render(<StorybookPreview story={mockStory} />);

    expect(screen.getByText('Chapter 1: The Beginning')).toBeInTheDocument();
    expect(screen.getByText('Once upon a time, in a land far away...')).toBeInTheDocument();
    expect(screen.getByText('Chapter 2: The Adventure')).toBeInTheDocument();
    expect(screen.getByText('Our hero embarked on a perilous journey...')).toBeInTheDocument();
  });

  it('should render chapter images with correct src and alt attributes', () => {
    render(<StorybookPreview story={mockStory} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);

    expect(images[0]).toHaveAttribute('src', mockStory[0].imageData);
    expect(images[0]).toHaveAttribute('alt', `Illustration for Chapter ${mockStory[0].chapter}`);

    expect(images[1]).toHaveAttribute('src', mockStory[1].imageData);
    expect(images[1]).toHaveAttribute('alt', `Illustration for Chapter ${mockStory[1].chapter}`);
  });

  it('should render an "Export PDF" button', () => {
    render(<StorybookPreview story={mockStory} />);
    expect(screen.getByRole('button', { name: /export pdf/i })).toBeInTheDocument();
  });

  it('calls onExport when the Export PDF button is clicked', () => {
    const handleExportMock = jest.fn();
    render(<StorybookPreview story={mockStory} onExport={handleExportMock} isExporting={false} />);
    const exportButton = screen.getByRole('button', { name: /export pdf/i });
    fireEvent.click(exportButton);
    expect(handleExportMock).toHaveBeenCalledTimes(1);
  });

  it('disables the Export PDF button and shows "Preparing PDF..." when isExporting is true', () => {
    const handleExportMock = jest.fn();
    render(<StorybookPreview story={mockStory} onExport={handleExportMock} isExporting={true} />);
    const exportButton = screen.getByRole('button', { name: /preparing pdf.../i });
    expect(exportButton).toBeDisabled();
  });
});