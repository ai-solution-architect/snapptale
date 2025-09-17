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

  // TDD Cycle 3: Test the AI provider switch logic
  it('should throw an error for an unknown provider', async () => {
    process.env.AI_PROVIDER = 'unknown_provider';
    const childName = 'Alex';
    const childPhoto = new File([''], 'alex-photo.png', { type: 'image/png' });
    await expect(generateStory(childName, childPhoto)).rejects.toThrow(
      'Unknown AI provider: unknown_provider'
    );
    delete process.env.AI_PROVIDER;
  });

  it('should throw a not-implemented error for the ollama provider', async () => {
    process.env.AI_PROVIDER = 'ollama';
    const childName = 'Alex';
    const childPhoto = new File([''], 'alex-photo.png', { type: 'image/png' });
    await expect(generateStory(childName, childPhoto)).rejects.toThrow(
      'Ollama provider not implemented yet.'
    );
    delete process.env.AI_PROVIDER;
  });
});
