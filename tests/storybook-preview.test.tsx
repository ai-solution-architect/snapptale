import { render, screen } from '@testing-library/react';
import StorybookPreview from '@/components/StorybookPreview';

const mockStory = [
  {
    chapter: 1,
    title: 'The Beginning',
    text: 'Once upon a time, in a land far away...',
    imageData: 'base64image1',
    mimeType: 'image/png',
  },
  {
    chapter: 2,
    title: 'The Adventure',
    text: 'Our hero embarked on a perilous journey...',
    imageData: 'base64image2',
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
});