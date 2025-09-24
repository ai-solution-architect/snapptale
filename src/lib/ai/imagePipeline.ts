// src/lib/ai/imagePipeline.ts

/**
 * @file This file contains the logic for the image processing pipeline.
 */

import { generateImageDescription, generatePersonalizedImage, generateImageForChapter } from './image';
import { generateStory } from './index';

/**
 * Processes the image pipeline to generate a complete story with images.
 * @param childName The name of the child for the story
 * @param imageFile The image file to process
 * @returns A promise that resolves with the story and personalized image
 */
export async function processImagePipeline(childName: string, imageFile: File) {
  // Step 1: Generate detailed description of the image to identify main character
  const imageDescription = await generateImageDescription(imageFile);
  
  // Step 2: Generate personalized image based on the description
  const personalizedImage = await generatePersonalizedImage(imageDescription);
  
  // Step 3: Generate story using the personalized image
  // TODO: In the future, we should pass the personalized image to generateStory
  const storyResult = await generateStory(childName, imageFile);
  
  // Step 4: Generate chapter-specific images using the original image and chapter descriptions
  const chapterImagePromises = storyResult.story.map((chapter: any) => 
    generateChapterImageWithOriginal(imageFile, chapter.illustration_description)
  );
  
  // Step 5: Wait for all chapter images to be generated
  const chapterImages = await Promise.all(chapterImagePromises);
  
  // Step 6: Update the story with the new chapter images
  const updatedStory = storyResult.story.map((chapter: any, index: number) => ({
    ...chapter,
    imageData: chapterImages[index]
  }));
  
  // Step 7: Return the story and personalized image
  return {
    story: updatedStory,
    personalizedImage: personalizedImage
  };
}

/**
 * Generates a chapter image using the original image and chapter description.
 * This function uses Google AI's image editing capabilities.
 * @param originalImage The original uploaded image
 * @param chapterDescription The description for the chapter illustration
 * @returns A promise that resolves with the base64 encoded image data
 */
async function generateChapterImageWithOriginal(originalImage: File, chapterDescription: string): Promise<string> {
  // TODO: Implement actual image editing using the original image
  // For now, we'll use the existing generateImageForChapter function
  return generateImageForChapter(chapterDescription);
}