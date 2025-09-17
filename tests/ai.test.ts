// tests/ai.test.ts

/**
 * @file Test suite for the AI service abstraction layer.
 *
 * We will follow a strict TDD approach, starting with tests that define the
 * desired functionality before any implementation is written.
 */

import { TextEncoder } from 'util';
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

  // TDD Cycle 4: Test the Ollama provider implementation
  it('should call the Ollama API with the correct payload', async () => {
    // Spy on the global fetch function to intercept the network call.
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          response: JSON.stringify({
            story: [{ chapter: 1, text: 'A mock story.', illustration_description: 'A mock description.' }]
          }),
        }),
      } as Response)
    );

    process.env.AI_PROVIDER = 'ollama';
    const childName = 'Alex';
    // The 'File' object in the Node.js test environment doesn't have the arrayBuffer method.
    // We create a mock object that simulates the structure of a browser File object
    // for the purpose of this test.
    const photoContent = 'photo content';
    const childPhoto = {
      name: 'alex-photo.png',
      type: 'image/png',
      arrayBuffer: () => Promise.resolve(new TextEncoder().encode(photoContent).buffer),
    } as File;

    await generateStory(childName, childPhoto);

    // We expect fetch to have been called.
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // We can inspect the call to ensure the URL and body are correct.
    const fetchCall = fetchSpy.mock.calls[0];
    const url = fetchCall[0];
    const options = fetchCall[1] as RequestInit;
    const body = JSON.parse(options.body as string);

    expect(url).toBe('http://localhost:11434/api/generate');
    expect(body.model).toBe('llava');
    expect(body.prompt).toContain('Alex');
    expect(body.images).toHaveLength(1);

    // Restore the original fetch function after the test.
    fetchSpy.mockRestore();
    delete process.env.AI_PROVIDER;
  });
});
