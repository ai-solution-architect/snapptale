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

// Mock the story generation function
jest.mock('@/lib/ai/index', () => ({
  generateStory: jest.fn().mockResolvedValue({
    story: [
      {
        chapter: 1,
        title: 'Chapter 1',
        text: 'This is the text for chapter 1',
        illustration_description: 'Illustration for chapter 1',
        imageData: 'data:image/png;base64,chapter1',
        mimeType: 'image/png'
      },
      {
        chapter: 2,
        title: 'Chapter 2',
        text: 'This is the text for chapter 2',
        illustration_description: 'Illustration for chapter 2',
        imageData: 'data:image/png;base64,chapter2',
        mimeType: 'image/png'
      },
      {
        chapter: 3,
        title: 'Chapter 3',
        text: 'This is the text for chapter 3',
        illustration_description: 'Illustration for chapter 3',
        imageData: 'data:image/png;base64,chapter3',
        mimeType: 'image/png'
      }
    ]
  })
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

  it('should call the image processing functions in the correct sequence', async () => {
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
    expect(generateImageForChapter).toHaveBeenNthCalledWith(1, 'Illustration for chapter 1');
    expect(generateImageForChapter).toHaveBeenNthCalledWith(2, 'Illustration for chapter 2');
    expect(generateImageForChapter).toHaveBeenNthCalledWith(3, 'Illustration for chapter 3');
  });

  it('should process independent tasks in parallel', async () => {
    // Arrange
    const childName = 'Test Child';
    const photoContent = 'fake-photo-content';
    const mockFile = {
      name: 'test-photo.jpg',
      type: 'image/jpeg',
      arrayBuffer: () =>
        Promise.resolve(new TextEncoder().encode(photoContent).buffer),
    } as File;

    // Mock functions with delays to simulate real processing time
    const { generateImageDescription, generatePersonalizedImage, generateImageForChapter } = 
      await import('@/lib/ai/image');
    
    (generateImageDescription as jest.Mock).mockImplementation(async () => {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 10));
      return 'A description of the image';
    });
    
    (generatePersonalizedImage as jest.Mock).mockImplementation(async () => {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 10));
      return 'data:image/png;base64,placeholder1';
    });
    
    (generateImageForChapter as jest.Mock).mockImplementation(async () => {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 10));
      return 'data:image/png;base64,placeholder2';
    });

    // Act & Assert
    // This test should verify that the pipeline processes tasks in parallel
    // We'll measure the time it takes to complete and ensure it's less than
    // the sum of all individual task times if they were processed sequentially
    const startTime = Date.now();
    await processImagePipeline(childName, mockFile);
    const endTime = Date.now();
    
    // If tasks were processed sequentially, it would take at least 50ms (5 tasks * 10ms each)
    // If processed in parallel, it should take less time
    const totalTime = endTime - startTime;
    
    // With parallel processing, we expect the time to be closer to the longest individual task
    // rather than the sum of all tasks
    expect(totalTime).toBeLessThan(40); // Less than 40ms if processed in parallel
  });

  it('should call generateStory to generate actual story content', async () => {
    // Arrange
    const childName = 'Test Child';
    const photoContent = 'fake-photo-content';
    const mockFile = {
      name: 'test-photo.jpg',
      type: 'image/jpeg',
      arrayBuffer: () =>
        Promise.resolve(new TextEncoder().encode(photoContent).buffer),
    } as File;

    // Import the mocked generateStory function
    const { generateStory } = await import('@/lib/ai/index');

    // Act
    await processImagePipeline(childName, mockFile);

    // Assert
    expect(generateStory).toHaveBeenCalledWith(childName, mockFile);
  });
});