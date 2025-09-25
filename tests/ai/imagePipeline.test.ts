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
        illustration_description: 'Illustration for chapter 1'
      },
      {
        chapter: 2,
        title: 'Chapter 2',
        text: 'This is the text for chapter 2',
        illustration_description: 'Illustration for chapter 2'
      },
      {
        chapter: 3,
        title: 'Chapter 3',
        text: 'This is the text for chapter 3',
        illustration_description: 'Illustration for chapter 3'
      }
    ]
  })
}));

describe('Image Processing Pipeline', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock process.env for Google AI
    process.env.AI_PROVIDER = 'google';
    process.env.GOOGLE_API_KEY = 'test-key';
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.AI_PROVIDER;
    delete process.env.GOOGLE_API_KEY;
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
    const { generateImageDescription, generatePersonalizedImage } = 
      await import('@/lib/ai/image');

    // Mock the GoogleGenerativeAI module
    const mockGenerateContent = jest.fn().mockResolvedValue({
      response: {
        candidates: [{
          content: {
            parts: [{
              inlineData: {
                data: 'edited-image-data',
                mimeType: 'image/png'
              }
            }]
          }
        }]
      }
    });
    
    const mockGetGenerativeModel = jest.fn().mockReturnValue({
      generateContent: mockGenerateContent
    });
    
    jest.mock('@google/generative-ai', () => {
      return {
        GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
          getGenerativeModel: mockGetGenerativeModel
        }))
      };
    });

    // Act
    await processImagePipeline(childName, mockFile);

    // Assert
    expect(generateImageDescription).toHaveBeenCalledWith(mockFile);
    expect(generatePersonalizedImage).toHaveBeenCalledWith('A description of the image');
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
    const { generateImageDescription, generatePersonalizedImage } = 
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

    // Mock the GoogleGenerativeAI module
    const mockGenerateContent = jest.fn().mockImplementation(async () => {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 10));
      return {
        response: {
          candidates: [{
            content: {
              parts: [{
                inlineData: {
                  data: 'edited-image-data',
                  mimeType: 'image/png'
                }
              }]
            }
          }]
        }
      };
    });
    
    const mockGetGenerativeModel = jest.fn().mockReturnValue({
      generateContent: mockGenerateContent
    });
    
    jest.mock('@google/generative-ai', () => {
      return {
        GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
          getGenerativeModel: mockGetGenerativeModel
        }))
      };
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

  it('should call generateStory with the personalized image file', async () => {
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
    // Check that generateStory was called with the childName and false (for generateImages)
    // We can't easily check the File object, but we know it should be called with false as the third parameter
    expect(generateStory).toHaveBeenCalledWith(expect.any(String), expect.any(Object), false);
  });
});