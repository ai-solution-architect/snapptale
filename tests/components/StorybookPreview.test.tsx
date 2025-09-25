// tests/components/StorybookPreview.test.tsx

/**
 * @file Test suite for the StorybookPreview component.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StorybookPreview from '@/components/StorybookPreview';

// Mock the usePdfExporter hook
jest.mock('@/hooks/usePdfExporter', () => ({
  usePdfExporter: () => ({
    isExporting: false,
    error: null,
    exportPdf: jest.fn(),
  }),
}));

describe('StorybookPreview', () => {
  const mockStory = [
    {
      chapter: 1,
      title: 'The Magic Forest',
      text: 'Once upon a time, Alex went to the forest.',
      imageData: 'data:image/png;base64,test',
      mimeType: 'image/png'
    },
    {
      chapter: 2,
      title: 'The Hidden Cave',
      text: 'In the cave, Alex found a treasure.',
      imageData: 'data:image/png;base64,test2',
      mimeType: 'image/png'
    }
  ];

  const mockOnExport = jest.fn();

  it('should render the story chapters with correct structure', () => {
    render(<StorybookPreview story={mockStory} onExport={mockOnExport} isExporting={false} />);
    
    // Check that both chapters are rendered
    expect(screen.getByText('Chapter 1: The Magic Forest')).toBeInTheDocument();
    expect(screen.getByText('Chapter 2: The Hidden Cave')).toBeInTheDocument();
    
    // Check that the text is rendered
    expect(screen.getByText('Once upon a time, Alex went to the forest.')).toBeInTheDocument();
    expect(screen.getByText('In the cave, Alex found a treasure.')).toBeInTheDocument();
  });

  it('should render images before text in each chapter', () => {
    render(<StorybookPreview story={mockStory} onExport={mockOnExport} isExporting={false} />);
    
    // Get all div elements that contain chapter content
    const chapters = screen.getAllByText(/Chapter \d:/).map(el => el.closest('div'));
    
    // For each chapter, check that the image comes before the text
    chapters.forEach((chapter, index) => {
      if (chapter) {
        const children = Array.from(chapter.children);
        const imageIndex = children.findIndex(child => child.tagName === 'IMG');
        const textIndex = children.findIndex(child => child.tagName === 'P');
        
        // Image should come before text
        expect(imageIndex).toBeLessThan(textIndex);
      }
    });
  });

  it('should format bold text correctly', () => {
    const storyWithBold = [
      {
        chapter: 1,
        title: 'The Bold Adventure',
        text: 'Once upon a time, **Alex** went to the forest.',
        imageData: 'data:image/png;base64,test',
        mimeType: 'image/png'
      }
    ];
    
    render(<StorybookPreview story={storyWithBold} onExport={mockOnExport} isExporting={false} />);
    
    // Check that the bold text is rendered as a strong element
    const boldElement = screen.getByText('Alex');
    expect(boldElement.tagName).toBe('STRONG');
  });

  it('should render the download button', () => {
    render(<StorybookPreview story={mockStory} onExport={mockOnExport} isExporting={false} />);
    
    const button = screen.getByText('Download your Tale');
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('should disable the download button when exporting', () => {
    render(<StorybookPreview story={mockStory} onExport={mockOnExport} isExporting={true} />);
    
    const button = screen.getByText('Preparing PDF...');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});