// src/lib/ai/image.ts

/**
 * @file This file contains the logic for generating images for story chapters.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { STORYBOOK_IMAGE_PROMPT } from '@/lib/ai/prompts';
/**
 * Helper function to initialize Google AI with the appropriate model and configuration.
 * @param model The model name to use
 * @param isImageGeneration Whether this is for image generation (requires responseModalities)
 * @returns The initialized GenerativeModel
 */
function initializeGoogleAI(model: string, isImageGeneration: boolean = false) {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('Missing GOOGLE_API_KEY');
  }
  
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  
  if (isImageGeneration) {
    return genAI.getGenerativeModel({ 
      model: model,
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"]
      }
    });
  } else {
    return genAI.getGenerativeModel({ model: model });
  }
}

/**
 * Helper function to extract image data from Google AI response.
 * @param result The response from Google AI
 * @returns Base64 encoded image data URL or null if no image found
 */
function extractImageDataFromResponse(result: any): string | null {
  try {
    if (result.response) {
      if (result.response.candidates && result.response.candidates.length > 0) {
        const candidate = result.response.candidates[0];
        
        if (candidate.content && candidate.content.parts) {
          for (let i = 0; i < candidate.content.parts.length; i++) {
            const part = candidate.content.parts[i];
            
            if (part.inlineData) {
              const imageData = part.inlineData.data;
              const mimeType = part.inlineData.mimeType || 'image/png';
              
              return `data:${mimeType};base64,${imageData}`;
            }
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting image data from response:', error);
    return null;
  }
}

/**
 * Helper function to handle errors and return a placeholder image.
 * @returns A base64 encoded placeholder image
 */
function getPlaceholderImage(): string {
  const placeholderImage =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  return `data:image/png;base64,${placeholderImage}`;
}

// Stub for image generation abstraction (to be implemented in future cycles)
export async function generateImageForChapter(
  illustration_description: string
): Promise<string> {
  const provider = process.env.AI_PROVIDER || 'ollama';
  
  if (provider === 'google') {
    try {
      // Initialize Google AI with the correct model for image generation
      const model = initializeGoogleAI('gemini-2.5-flash-image-preview', true);
      
      // Generate content with the prompt
      const result = await model.generateContent([
        `Generate an image for a children's storybook based on this description: ${illustration_description}. Matching the following guide: ` + STORYBOOK_IMAGE_PROMPT
      ]);
      
      // Extract image data from the response
      const imageData = extractImageDataFromResponse(result);
      if (imageData) {
        return imageData;
      }
      
      // If no image data was found, return a placeholder
      return getPlaceholderImage();
    } catch (error) {
      // If there's an error with the AI service, return a placeholder image
      console.error('Error generating chapter image with Google AI:', error);
      return getPlaceholderImage();
    }
  } else {
    // TODO: Implement actual image generation logic for other providers
    return getPlaceholderImage();
  }
}

/**
 * Generates a description of an image to identify the main character.
 * @param imageFile The image file to describe
 * @returns A promise that resolves with the image description
 */
export async function generateImageDescription(imageFile: File): Promise<string> {
  const provider = process.env.AI_PROVIDER || 'ollama';
  
  if (provider === 'google') {
    try {
      // Convert file to base64
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = buffer.toString('base64');
      
      // Initialize Google AI with the correct model for text generation
      const model = initializeGoogleAI('gemini-2.5-flash', false);
      
      // Create the image part for the request
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: imageFile.type || 'image/png',
        },
      };
      
      // Generate content with the image
      const result = await model.generateContent([
        'Describe this image focusing on identifying the main character. Provide a detailed description that could be used to generate a personalized image of the character. Remember that the description need to also describe the scenario in detail, considering that the story generated need to be about the main character in the scenario identified. Using the following pattern: ' + STORYBOOK_IMAGE_PROMPT,
        imagePart
      ]);
      
      const description = result.response.text();
      return description;
    } catch (error) {
      // If there's an error with the AI service, return a placeholder description
      console.error('Error generating image description with Google AI:', error);
      return "A placeholder description of the image";
    }
  } else {
    // TODO: Implement actual image description logic for other providers
    return "A placeholder description of the image";
  }
}

/**
 * Generates a personalized image based on a prompt.
 * @param prompt The prompt to generate an image from
 * @returns A promise that resolves with the base64 encoded image data
 */
export async function generatePersonalizedImage(prompt: string): Promise<string> {
  const provider = process.env.AI_PROVIDER || 'ollama';
  
  if (provider === 'google') {
    try {
      // Initialize Google AI with the correct model for image generation
      const model = initializeGoogleAI('gemini-2.5-flash-image-preview', true);
      
      // Generate content with the prompt
      const result = await model.generateContent([
        `Generate a personalized image based on this description: ${prompt}. The image should be suitable for a children's storybook. Matching the following guide: ` + STORYBOOK_IMAGE_PROMPT
      ]);
      
      // Extract image data from the response
      const imageData = extractImageDataFromResponse(result);
      if (imageData) {
        return imageData;
      }
      
      // If no image data was found, return a placeholder
      return getPlaceholderImage();
    } catch (error) {
      // If there's an error with the AI service, return a placeholder image
      console.error('Error generating personalized image with Google AI:', error);
      return getPlaceholderImage();
    }
  } else {
    // TODO: Implement actual personalized image generation logic for other providers
    return getPlaceholderImage();
  }
}
