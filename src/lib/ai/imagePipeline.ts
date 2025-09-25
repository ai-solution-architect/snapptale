// src/lib/ai/imagePipeline.ts

/**
 * @file This file contains the logic for the image processing pipeline.
 */

import { generateImageDescription, generatePersonalizedImage } from './image';
import { generateStory } from './index';
import { STORYBOOK_IMAGE_PROMPT } from '@/lib/ai/prompts';

/**
 * Converts a base64 data URL to a File object.
 * @param dataUrl The base64 data URL string
 * @param filename The filename for the File object
 * @returns A File object
 */
function dataUrlToFile(dataUrl: string, filename: string): File {
  // Extract the base64 data and MIME type
  const parts = dataUrl.split(';base64,');
  const mimeType = parts[0].split(':')[1];
  const base64Data = parts[1];
  
  // Convert base64 to binary
  const byteString = atob(base64Data);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  // Create and return the File object
  return new File([ab], filename, { type: mimeType });
}

/**
 * Processes the image pipeline to generate a complete story with images.
 * @param childName The name of the child for the story
 * @param imageFile The image file to process
 * @returns A promise that resolves with the story and personalized image
 */
export async function processImagePipeline(childName: string, imageFile: File) {
  try {
    // Step 1: Generate detailed description of the image to identify main character
    const imageDescription = await generateImageDescription(imageFile);
    
    // Step 2: Generate personalized image based on the description
    const personalizedImage = await generatePersonalizedImage(imageDescription);
    
    // Step 3: Convert personalized image to File object for further processing
    const personalizedImageFile = dataUrlToFile(personalizedImage, 'personalized-image.png');
    
    // Step 4: Generate story WITHOUT images to avoid duplication, using the personalized image
    const storyResult = await generateStory(childName, personalizedImageFile, false); // Pass false to skip image generation
    
    // Step 5: Generate chapter-specific images using the personalized image and chapter descriptions
    const chapterImagePromises = storyResult.story.map((chapter: any, index: number) => {
      return generateChapterImageWithOriginal(personalizedImageFile, chapter.illustration_description);
    });
    
    // Step 6: Wait for all chapter images to be generated
    const chapterImages = await Promise.all(chapterImagePromises);
    
    // Step 7: Update the story with the new chapter images
    const updatedStory = storyResult.story.map((chapter: any, index: number) => ({
      ...chapter,
      imageData: chapterImages[index]
    }));
    
    // Step 8: Return the story and personalized image
    return {
      story: updatedStory,
      personalizedImage: personalizedImage
    };
  } catch (error) {
    console.error('[IMAGE PIPELINE ERROR] Error in image processing pipeline:', error);
    throw error;
  }
}

/**
 * Generates a chapter image using the original image and chapter description.
 * This function uses Google AI's image editing capabilities.
 * @param originalImage The original uploaded image
 * @param chapterDescription The description for the chapter illustration
 * @returns A promise that resolves with the base64 encoded image data
 */
async function generateChapterImageWithOriginal(originalImage: File, chapterDescription: string): Promise<string> {
  try {
    // Check if we're using Google AI
    if (process.env.AI_PROVIDER !== 'google' || !process.env.GOOGLE_API_KEY) {
      // Fallback to the existing generateImageForChapter function for non-Google providers
      const { generateImageForChapter } = await import('./image');
      return await generateImageForChapter(chapterDescription);
    }
    
    // Import GoogleGenerativeAI dynamically
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    
    // Convert the original image to base64
    const arrayBuffer = await originalImage.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    
    // Initialize Google AI with the correct model for image editing
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-image-preview',
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"]
      }
    });
    
    // Create the image part for the request
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: originalImage.type || 'image/png',
      },
    };
    
    // Generate content with the image and editing instructions
    const result = await model.generateContent([
      `Edit this image to match the following scene description for a children's storybook: ${chapterDescription}. 
      Keep the main character's appearance consistent with the original image, but change the background and setting to match the scene description.
      Ensure the style match with the original image. Matching with the following guide: ${STORYBOOK_IMAGE_PROMPT}`,
      imagePart
    ]);
    
    // Extract image data from the response
    if (result.response && result.response.candidates && result.response.candidates.length > 0) {
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
    
    // If no image data was found, fallback to generating a new image
    const { generateImageForChapter } = await import('./image');
    return await generateImageForChapter(chapterDescription);
  } catch (error) {
    console.error('[IMAGE PIPELINE ERROR] Error editing chapter image with Google AI:', error);
    // Fallback to generating a new image
    const { generateImageForChapter } = await import('./image');
    return await generateImageForChapter(chapterDescription);
  }
}