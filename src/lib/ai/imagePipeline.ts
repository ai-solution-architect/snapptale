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
  // Step 1: Start generating image description (needed for both personalized image and chapter images)
  const imageDescriptionPromise = generateImageDescription(imageFile);
  
  // Step 2: Start generating personalized image in parallel with image description
  const personalizedImagePromise = imageDescriptionPromise.then(description => 
    generatePersonalizedImage(description)
  );
  
  // Step 3: Wait for image description to generate chapter images
  const imageDescription = await imageDescriptionPromise;
  
  // Step 4: Generate chapter images in parallel
  const chapterImagePromises = [];
  for (let i = 0; i < 3; i++) {
    chapterImagePromises.push(generateImageForChapter(`Chapter ${i + 1} illustration`));
  }
  
  // Step 5: Wait for all chapter images to be generated
  const chapterImages = await Promise.all(chapterImagePromises);
  
  // Step 6: Wait for personalized image to be generated
  const personalizedImage = await personalizedImagePromise;
  
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