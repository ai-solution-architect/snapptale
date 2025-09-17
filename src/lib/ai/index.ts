// src/lib/ai/index.ts

/**
 * @file This file serves as the abstraction layer for our AI services.
 */

// Defines the structure for a single chapter of the story.
// By creating a type, we ensure that all parts of the application
// expect the same data shape.
export interface StoryChapter {
  chapter: number;
  text: string;
  imageData: string;
  mimeType: string;
}

// We now define the function signature according to our business domain
// and make it async. It throws an error because the implementation is not
// yet complete. This satisfies our second TDD cycle.
export async function generateStory(
  childName: string,
  childPhoto: File
): Promise<{ story: StoryChapter[] }> {
  // We use an environment variable to determine which AI provider to use.
  const provider = process.env.AI_PROVIDER || 'ollama'; // Default to ollama

  switch (provider) {
    case 'ollama':
      throw new Error('Ollama provider not implemented yet.');
    case 'google':
      throw new Error('Google AI provider not implemented yet.');
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}
