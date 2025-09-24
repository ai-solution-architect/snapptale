// src/lib/ai/imagePipeline.ts

/**
 * @file This file contains the logic for the image processing pipeline.
 */

import { generateImageDescription, generatePersonalizedImage, generateImageForChapter } from './image';

/**
 * Processes the image pipeline to generate a complete story with images.
 * @param childName The name of the child for the story
 * @param imageFile The image file to process
 * @returns A promise that resolves with the story and personalized image
 */
export async function processImagePipeline(childName: string, imageFile: File) {
  // Step 1: Generate image description
  const imageDescription = await generateImageDescription(imageFile);
  
  // Step 2: Generate personalized image based on the description
  const personalizedImage = await generatePersonalizedImage(imageDescription);
  
  // Step 3: Generate chapter images (3 chapters)
  const chapterImages = [];
  for (let i = 0; i < 3; i++) {
    const chapterImage = await generateImageForChapter(`Chapter ${i + 1} illustration`);
    chapterImages.push(chapterImage);
  }
  
  // Return the expected structure
  return {
    story: chapterImages.map((imageData, index) => ({
      chapter: index + 1,
      title: `Chapter ${index + 1}`,
      text: `This is the text for chapter ${index + 1}`,
      illustration_description: `Illustration for chapter ${index + 1}`,
      imageData: imageData,
      mimeType: 'image/png'
    })),
    personalizedImage: personalizedImage
  };
}