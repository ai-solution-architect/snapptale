// tests/ai/image.test.ts

/**
 * @file Test suite for the image generation functions.
 */

import { TextEncoder } from 'util';
import { generateImageDescription, generatePersonalizedImage, generateImageForChapter } from '@/lib/ai/image';

describe('Image Generation Functions', () => {
  describe('generateImageDescription', () => {
    it('should generate a description of an image', async () => {
      // Arrange
      const photoContent = 'fake-photo-content';
      const mockFile = {
        type: 'image/jpeg',
        arrayBuffer: () =>
          Promise.resolve(new TextEncoder().encode(photoContent).buffer),
      } as File;

      // Act
      const result = await generateImageDescription(mockFile);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
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
  });
});