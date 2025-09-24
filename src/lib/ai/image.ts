// src/lib/ai/image.ts

/**
 * @file This file contains the logic for generating images for story chapters.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

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

// Stub for image generation abstraction (to be implemented in future cycles)
export async function generateImageForChapter(
  illustration_description: string
): Promise<string> {
  const provider = process.env.AI_PROVIDER || 'ollama';
  
  if (provider === 'google') {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('Missing GOOGLE_API_KEY');
    }
    
    try {
      // Initialize Google AI with the correct model for image generation
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash-image-preview',
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"]
        }
      });
      
      // Generate content with the prompt
      const result = await model.generateContent([
        `Generate an image for a children's storybook based on this description: ${illustration_description}`
      ]);
      
      // Extract image data from the response
      if (result.response.candidates && result.response.candidates[0].content.parts) {
        for (const part of result.response.candidates[0].content.parts) {
          if (part.inlineData) {
            const imageData = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            return `data:${mimeType};base64,${imageData}`;
          }
        }
      }
      
      // If no image data was found, return a placeholder
      const placeholderImage =
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      return `data:image/png;base64,${placeholderImage}`;
    } catch (error) {
      // If there's an error with the AI service, return a placeholder image
      console.error('Error generating chapter image with Google AI:', error);
      const placeholderImage =
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      return `data:image/png;base64,${placeholderImage}`;
    }
  } else {
    // TODO: Implement actual image generation logic for other providers
    const placeholderImage =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    return `data:image/png;base64,${placeholderImage}`;
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
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('Missing GOOGLE_API_KEY');
    }
    
    try {
      // Convert file to base64
      const base64Image = await fileToBase64(imageFile);
      
      // Initialize Google AI
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      // Create the image part for the request
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: imageFile.type || 'image/png',
        },
      };
      
      // Generate content with the image
      const result = await model.generateContent([
        'Describe this image focusing on identifying the main character. Provide a detailed description that could be used to generate a personalized image of the character. Remember that the description need to also describe the scenario in detail, considering that the story generated need to be about the main character in the scenario identified.',
        imagePart
      ]);
      
      return result.response.text();
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
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('Missing GOOGLE_API_KEY');
    }
    
    try {
      // Initialize Google AI with the correct model for image generation
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash-image-preview',
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"]
        }
      });
      
      // Generate content with the prompt
      const result = await model.generateContent([
        `Generate a personalized image based on this description: ${prompt}. The image should be suitable for a children's storybook.`
      ]);
      
      // Extract image data from the response
      if (result.response.candidates && result.response.candidates[0].content.parts) {
        for (const part of result.response.candidates[0].content.parts) {
          if (part.inlineData) {
            const imageData = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            return `data:${mimeType};base64,${imageData}`;
          }
        }
      }
      
      // If no image data was found, return a placeholder
      const placeholderImage =
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      return `data:image/png;base64,${placeholderImage}`;
    } catch (error) {
      // If there's an error with the AI service, return a placeholder image
      console.error('Error generating personalized image with Google AI:', error);
      const placeholderImage =
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      return `data:image/png;base64,${placeholderImage}`;
    }
  } else {
    // TODO: Implement actual personalized image generation logic for other providers
    const placeholderImage =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    return `data:image/png;base64,${placeholderImage}`;
  }
}
