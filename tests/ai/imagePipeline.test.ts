// tests/ai/imagePipeline.test.ts

/**
 * @file Test suite for the image processing pipeline.
 */

import { TextEncoder } from 'util';
import { processImagePipeline } from '@/lib/ai/imagePipeline';

describe('Image Processing Pipeline', () => {
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
});