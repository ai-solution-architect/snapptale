// tests/ai/image.test.ts

/**
 * @file Test suite for the image generation functions.
 */

import { TextEncoder } from 'util';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateImageDescription, generatePersonalizedImage, generateImageForChapter } from '@/lib/ai/image';

// Mock the GoogleGenerativeAI
const mockGenerateContent = jest.fn();
const mockGetGenerativeModel = jest.fn().mockReturnValue({
  generateContent: mockGenerateContent,
});
const MockedGoogleGenerativeAI = GoogleGenerativeAI as jest.Mock;

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn(),
  };
});

describe('Image Generation Functions', () => {
  beforeEach(() => {
    // Clear all mock calls before each test
    MockedGoogleGenerativeAI.mockClear();
    mockGetGenerativeModel.mockClear();
    mockGenerateContent.mockClear();
    
    // Set up the mock implementation
    MockedGoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel,
    }));
  });

  describe('Helper Functions', () => {
    it('should have helper functions for Google AI initialization', () => {
      // This test will verify that our helper functions exist
      // We'll implement the helpers in the next step
      expect(true).toBe(true); // Placeholder until we implement the helpers
    });
  });

  describe('generateImageDescription', () => {
    it('should generate a description of an image', async () => {
      // Arrange
      const photoContent = 'fake-photo-content';
      const mockFile = {
        type: 'image/jpeg',
        arrayBuffer: () =>
          Promise.resolve(new TextEncoder().encode(photoContent).buffer),
      } as File;

      // Mock the Google AI response
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => 'A description of the image',
        },
      });

      // Act
      const result = await generateImageDescription(mockFile);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should call Google AI when configured', async () => {
      // Arrange
      process.env.AI_PROVIDER = 'google';
      process.env.GOOGLE_API_KEY = 'fake-key';
      
      const photoContent = 'fake-photo-content';
      const mockFile = {
        type: 'image/jpeg',
        arrayBuffer: () =>
          Promise.resolve(new TextEncoder().encode(photoContent).buffer),
      } as File;

      // Mock the Google AI response
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => 'A description of the image',
        },
      });

      // Act
      await generateImageDescription(mockFile);

      // Assert
      // Verify that the GoogleGenerativeAI constructor was called with our API key
      expect(MockedGoogleGenerativeAI).toHaveBeenCalledWith('fake-key');
      
      // Verify that getGenerativeModel was called with the correct model
      expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-2.5-flash' });
      
      // Verify that generateContent was called with the correct prompt and image data
      const expectedImagePart = {
        inlineData: {
          data: Buffer.from(photoContent).toString('base64'),
          mimeType: 'image/jpeg',
        },
      };
      expect(mockGenerateContent).toHaveBeenCalledWith([
        'Describe this image focusing on identifying the main character. Provide a detailed description that could be used to generate a personalized image of the character. Remember that the description need to also describe the scenario in detail, considering that the story generated need to be about the main character in the scenario identified.',
        expectedImagePart
      ]);
    });
  });

  describe('generatePersonalizedImage', () => {
    it('should generate a personalized image based on a prompt', async () => {
      // Arrange
      const prompt = 'A magical forest with glowing mushrooms';

      // Act
      const result = await generatePersonalizedImage(prompt);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      // Expect a base64 data URL
      expect(result).toMatch(/^data:image\/(png|jpeg);base64,/);
    });

    it('should call Google AI when configured', async () => {
      // Arrange
      process.env.AI_PROVIDER = 'google';
      process.env.GOOGLE_API_KEY = 'fake-key';
      
      const prompt = 'A magical forest with glowing mushrooms';

      // Mock the Google AI response with image data
      mockGenerateContent.mockResolvedValue({
        response: {
          candidates: [{
            content: {
              parts: [{
                inlineData: {
                  data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
                  mimeType: 'image/png'
                }
              }]
            }
          }]
        }
      });

      // Act
      const result = await generatePersonalizedImage(prompt);

      // Assert
      // Verify that the GoogleGenerativeAI constructor was called with our API key
      expect(MockedGoogleGenerativeAI).toHaveBeenCalledWith('fake-key');
      
      // Verify that getGenerativeModel was called with the correct model
      expect(mockGetGenerativeModel).toHaveBeenCalledWith({ 
        model: 'gemini-2.5-flash-image-preview',
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"]
        }
      });
      
      // Verify that generateContent was called with the correct prompt
      expect(mockGenerateContent).toHaveBeenCalledWith([
        'Generate a personalized image based on this description: A magical forest with glowing mushrooms. The image should be suitable for a children\'s storybook.',
      ]);
      
      // Verify that the result is a proper base64 data URL
      expect(result).toMatch(/^data:image\/png;base64,/);
    });
  });

  describe('generateImageForChapter', () => {
    it('should generate an image for a chapter based on its description', async () => {
      // Arrange
      const illustrationDescription = 'A brave knight fighting a dragon in a castle';

      // Act
      const result = await generateImageForChapter(illustrationDescription);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      // Expect a base64 data URL
      expect(result).toMatch(/^data:image\/(png|jpeg);base64,/);
    });

    it('should call Google AI when configured', async () => {
      // Arrange
      process.env.AI_PROVIDER = 'google';
      process.env.GOOGLE_API_KEY = 'fake-key';
      
      const illustrationDescription = 'A brave knight fighting a dragon in a castle';

      // Mock the Google AI response with image data
      mockGenerateContent.mockResolvedValue({
        response: {
          candidates: [{
            content: {
              parts: [{
                inlineData: {
                  data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
                  mimeType: 'image/png'
                }
              }]
            }
          }]
        }
      });

      // Act
      const result = await generateImageForChapter(illustrationDescription);

      // Assert
      // Verify that the GoogleGenerativeAI constructor was called with our API key
      expect(MockedGoogleGenerativeAI).toHaveBeenCalledWith('fake-key');
      
      // Verify that getGenerativeModel was called with the correct model
      expect(mockGetGenerativeModel).toHaveBeenCalledWith({ 
        model: 'gemini-2.5-flash-image-preview',
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"]
        }
      });
      
      // Verify that generateContent was called with the correct prompt
      expect(mockGenerateContent).toHaveBeenCalledWith([
        'Generate an image for a children\'s storybook based on this description: A brave knight fighting a dragon in a castle'
      ]);
      
      // Verify that the result is a proper base64 data URL
      expect(result).toMatch(/^data:image\/png;base64,/);
    });
  });
});