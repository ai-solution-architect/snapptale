// tests/ai/imagePipeline.test.ts

/**
 * @file Test suite for the image processing pipeline.
 */

import { TextEncoder } from 'util';
import { processImagePipeline } from '@/lib/ai/imagePipeline';

// Mock the image processing functions
jest.mock('@/lib/ai/image', () => ({
  generateImageDescription: jest.fn().mockResolvedValue('A description of the image'),
  generatePersonalizedImage: jest.fn().mockResolvedValue('data:image/png;base64,placeholder1'),
  generateImageForChapter: jest.fn().mockResolvedValue('data:image/png;base64,placeholder2')
}));

describe('Image Processing Pipeline', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should process the image pipeline and return a basic structure', async () => {
    // Arrange
    const childName = 'Test Child';
    const photoContent = 'fake-photo-content';
    const mockFile = {
      name: 'test-photo.jpg',
      type: 'image/jpeg',
      arrayBuffer: () =>
        Promise.resolve(new TextEncoder().encode(photoContent).buffer),
    } as File;

    // Act
    const result = await processImagePipeline(childName, mockFile);

    // Assert
    expect(result).toBeDefined();
  });

  it('should return the expected structure with story and images', async () => {
    // Arrange
    const childName = 'Test Child';
    const photoContent = 'fake-photo-content';
    const mockFile = {
      name: 'test-photo.jpg',
      type: 'image/jpeg',
      arrayBuffer: () =>
        Promise.resolve(new TextEncoder().encode(photoContent).buffer),
    } as File;

    // Act
    const result = await processImagePipeline(childName, mockFile);

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveProperty('story');
    expect(result).toHaveProperty('personalizedImage');
    expect(Array.isArray(result.story)).toBe(true);
    expect(typeof result.personalizedImage).toBe('string');
  });

  it('should call the image processing functions in sequence', async () => {
    // Arrange
    const childName = 'Test Child';
    const photoContent = 'fake-photo-content';
    const mockFile = {
      name: 'test-photo.jpg',
      type: 'image/jpeg',
      arrayBuffer: () =>
        Promise.resolve(new TextEncoder().encode(photoContent).buffer),
    } as File;

    // Import the mocked functions
    const { generateImageDescription, generatePersonalizedImage, generateImageForChapter } = 
      await import('@/lib/ai/image');

    // Act
    await processImagePipeline(childName, mockFile);

    // Assert
    expect(generateImageDescription).toHaveBeenCalledWith(mockFile);
    expect(generatePersonalizedImage).toHaveBeenCalledWith('A description of the image');
    // Check that generateImageForChapter was called exactly 3 times
    expect(generateImageForChapter).toHaveBeenCalledTimes(3);
    // Check the specific calls
    expect(generateImageForChapter).toHaveBeenNthCalledWith(1, 'Chapter 1 illustration');
    expect(generateImageForChapter).toHaveBeenNthCalledWith(2, 'Chapter 2 illustration');
    expect(generateImageForChapter).toHaveBeenNthCalledWith(3, 'Chapter 3 illustration');
  });
});