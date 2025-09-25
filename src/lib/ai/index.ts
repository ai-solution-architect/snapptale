// src/lib/ai/index.ts

/**
 * @file This file serves as the abstraction layer for our AI services.
 */

import { STORY_GENERATION_PROMPT } from './prompts';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateImageForChapter } from './image';

// Defines the structure for a single chapter of the story.
export interface StoryChapter {
  chapter: number;
  title: string; // The title of the chapter
  text: string;
  illustration_description: string; // Added to hold the prompt for the image
  imageData?: string;
  mimeType?: string;
}

/**
 * Resizes an image to a maximum dimension while maintaining aspect ratio.
 * This helps reduce the size of images sent to AI services.
 * @param file The image file to resize
 * @param maxSize The maximum width or height in pixels
 * @returns A promise that resolves with the resized image as a File
 */
async function resizeImage(file: File, maxSize: number = 1024): Promise<File> {
  // For now, we'll just return the original file since client-side image resizing
  // would require additional libraries. In a production environment, you might
  // want to implement actual image resizing.
  return file;
}

/**
 * Converts a File object to a Base64 encoded string.
 * This is a common requirement for sending image data in API requests.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 string.
 */
async function fileToBase64(file: File): Promise<string> {
  // Resize the image to prevent large payloads
  const resizedFile = await resizeImage(file, 1024);
  const arrayBuffer = await resizedFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  return base64;
}

/**
 * Checks if a model is available in the Ollama service.
 * @param modelName The name of the model to check
 * @returns A promise that resolves with true if the model is available, false otherwise
 */
async function isModelAvailable(modelName: string): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (!response.ok) return false;
    
    const data = await response.json();
    const isAvailable = data.models.some((model: any) => model.name === modelName);
    return isAvailable;
  } catch (error) {
    console.error('[AI SERVICE ERROR] Error checking model availability:', error);
    return false;
  }
}

/**
 * Generates a story using the local Ollama service.
 * This function contains the core logic for interacting with the Ollama API.
 * @param childName The name of the child for the story.
 * @param childPhoto The image to base the story on.
 * @param generateImages Whether to generate images for each chapter (default: true)
 * @returns A promise that resolves with the generated story.
 */
async function generateStoryWithOllama(
  childName: string,
  childPhoto: File,
  generateImages: boolean = true
): Promise<{ story: StoryChapter[] }> {
  const imageBase64 = await fileToBase64(childPhoto);

  const prompt = `${STORY_GENERATION_PROMPT}`;

  // Add a timeout controller for the fetch request
  // Set to 7 minutes to be longer than Ollama's 5 minute timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 420000); // 7 minutes timeout

  try {
    const model = process.env.OLLAMA_MODEL || 'llava';
    
    // Check if the model is available
    const modelAvailable = await isModelAvailable(model);
    if (!modelAvailable) {
      throw new Error(`The model '${model}' is not available. Please make sure you have pulled the model using 'ollama pull ${model}' or use an available model like 'llava'.`);
    }
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        prompt: prompt.replace('${childName}', childName),
        images: [imageBase64],
        stream: false,
        format: 'json',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Ollama API request failed with status ${response.status}: ${response.statusText}`;
      
      // Try to get more detailed error information from the response
      try {
        const errorData = await response.text();
        if (errorData) {
          errorMessage += `. Details: ${errorData}`;
        }
      } catch (e) {
        // If we can't parse the error details, just use the basic error
      }
      
      // Provide specific guidance for common errors
      if (response.status === 404) {
        errorMessage += `. The model '${model}' was not found. Available models: llava. Make sure you have pulled the correct model using 'ollama pull <model-name>'.`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const storyData = JSON.parse(data.response);

    if (generateImages) {
      const storyWithImages = await Promise.all(
        storyData.story.map(async (chapter: any) => {
          const imageData = await generateImageForChapter(
            chapter.illustration_description
          );
          
          return {
            ...chapter,
            imageData,
            mimeType: 'image/png',
          };
        })
      );
      
      return { story: storyWithImages };
    } else {
      // Return story without images
      return { story: storyData.story };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Ollama request timed out. The image might be too large or the model is taking too long to process.');
    }
    throw error;
  }
}

// Main function that acts as a router to the correct AI provider.
export async function generateStory(
  childName: string,
  childPhoto: File,
  generateImages: boolean = true
): Promise<{ story: StoryChapter[] }> {
  const provider = process.env.AI_PROVIDER || 'ollama';

  switch (provider) {
    case 'ollama':
      return generateStoryWithOllama(childName, childPhoto, generateImages);
    case 'google':
      if (!process.env.GOOGLE_API_KEY) {
        throw new Error('Missing GOOGLE_API_KEY');
      }
      return generateStoryWithGoogle(childName, childPhoto, generateImages);
    default:
      throw new Error("Unknown AI provider: " + provider);
  }
}

async function generateStoryWithGoogle(
  childName: string,
  childPhoto: File,
  generateImages: boolean = true
): Promise<{ story: StoryChapter[] }> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const imageBase64 = await fileToBase64(childPhoto);
  const prompt = STORY_GENERATION_PROMPT.replace('${childName}', childName);

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: childPhoto.type,
    },
  };

  const result = await model.generateContent([prompt, imagePart]);
  let responseText = result.response.text();

  // Clean the response to ensure it is valid JSON
  // Handle different markdown code block formats
  const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = responseText.match(jsonRegex);
  if (match && match[1]) {
    responseText = match[1];
  }

  // Additional cleaning to remove any remaining markdown or extra characters
  responseText = responseText.trim();
  
  // Try to parse the JSON, and if it fails, try to extract JSON from the response
  let storyData;
  try {
    storyData = JSON.parse(responseText);
  } catch (parseError) {
    // If parsing fails, try to find JSON-like content in the response
    const jsonLikeMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonLikeMatch) {
      try {
        storyData = JSON.parse(jsonLikeMatch[0]);
      } catch (secondParseError) {
        console.error('[AI SERVICE ERROR] Failed to parse extracted JSON-like content:', secondParseError);
        throw new Error(`Failed to parse JSON response: ${parseError.message}. Original response: ${responseText}`);
      }
    } else {
      console.error('[AI SERVICE ERROR] No JSON-like content found in response');
      throw new Error(`Failed to parse JSON response: ${parseError.message}. Original response: ${responseText}`);
    }
  }

  // Validate that the story data has the expected structure
  if (!storyData.story || !Array.isArray(storyData.story)) {
    throw new Error('Invalid story data format: missing or invalid "story" array');
  }

  if (generateImages) {
    // Asynchronously generate an image for each chapter
    const storyWithImages = await Promise.all(
      storyData.story.map(async (chapter: any, index: number) => {
        // Validate that each chapter has the required fields
        if (!chapter.chapter || !chapter.title || !chapter.text || !chapter.illustration_description) {
          console.error('[AI SERVICE ERROR] Invalid chapter data', { chapter, index });
          throw new Error(`Invalid chapter data at index ${index}: missing required fields`);
        }
        
        const imageData = await generateImageForChapter(
          chapter.illustration_description
        );
        
        return {
          ...chapter,
          imageData,
          mimeType: 'image/png', // Assuming PNG for now, can be improved later
        };
      })
    );

    return { story: storyWithImages };
  } else {
    // Return story without images
    return { story: storyData.story };
  }
}