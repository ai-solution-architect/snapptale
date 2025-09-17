// tests/ai.test.ts

/**
 * @file Test suite for the AI service abstraction layer.
 *
 * We will follow a strict TDD approach, starting with tests that define the
 * desired functionality before any implementation is written.
 */

import { generateStory } from '@/lib/ai';

describe('AI Service', () => {
  it('should be defined', () => {
    expect(generateStory).toBeDefined();
  });

  it('should be an async function that throws a not-implemented error', async () => {
    // Use variable names that reflect the business domain, as per our guide.
    const childName = 'Alex';
    const childPhoto = new File([''], 'alex-photo.png', { type: 'image/png' });

    // We expect the function to return a Promise that rejects with an error.
    // This proves the function is async and acknowledges it's not implemented.
    await expect(generateStory(childName, childPhoto)).rejects.toThrow(
      'AI provider not implemented yet.'
    );
  });
});
