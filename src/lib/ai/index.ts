// src/lib/ai/index.ts

/**
 * @file This file serves as the abstraction layer for our AI services.
 */

import { STORY_GENERATION_PROMPT } from './prompts';

// Defines the structure for a single chapter of the story.
export interface StoryChapter {
  chapter: number;
  text: string;
  imageData: string;
  mimeType: string;
}

/**
 * Converts a File object to a Base64 encoded string.
 * This is a common requirement for sending image data in API requests.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 string.
 */
async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
}

/**
 * Generates a story using the local Ollama service.
 * This function contains the core logic for interacting with the Ollama API.
 * @param childName The name of the child for the story.
 * @param childPhoto The image to base the story on.
 * @returns A promise that resolves with the generated story.
 */
async function generateStoryWithOllama(
  childName: string,
  childPhoto: File
): Promise<{ story: StoryChapter[] }> {
  const imageBase64 = await fileToBase64(childPhoto);

  const prompt = `${STORY_GENERATION_PROMPT}`;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llava',
      prompt: prompt.replace('${childName}', childName),
      images: [imageBase64],
      stream: false,
      format: 'json',
    }),
  });

  if (!response.ok) {
    throw new Error("Ollama API request failed: " + response.statusText);
  }

  const data = await response.json();
  const storyData = JSON.parse(data.response);

  // TODO: Image generation from the description is a future TDD cycle.
  const placeholderImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

  const storyWithImages = storyData.story.map((chapter: any) => ({
    ...chapter,
    imageData: placeholderImage,
    mimeType: 'image/png',
  }));

  return { story: storyWithImages };
}

// Main function that acts as a router to the correct AI provider.
export async function generateStory(
  childName: string,
  childPhoto: File
): Promise<{ story: StoryChapter[] }> {
  const provider = process.env.AI_PROVIDER || 'ollama';

  switch (provider) {
    case 'ollama':
      return generateStoryWithOllama(childName, childPhoto);
    case 'google':
      throw new Error('Google AI provider not implemented yet.');
    default:
      throw new Error("Unknown AI provider: " + provider);
  }
}