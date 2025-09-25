// scripts/debug-image.mjs
// Simple script to test image generation with enhanced logging

console.log('=== DEBUG IMAGE GENERATION SCRIPT ===');
console.log('This script is meant to be run through the development server.');
console.log('To test image generation:');
console.log('1. Start the development server with: npm run dev');
console.log('2. Upload an image through the UI');
console.log('3. Check the console logs for detailed debugging information');
console.log('4. Check the debug-images directory for saved images');
console.log('\nFor manual testing, you can also run individual functions by importing them in a Next.js API route.');

import { generateImageForChapter } from '../src/lib/ai/image.js';

async function testImageGeneration() {
  console.log('=== TESTING IMAGE GENERATION ===');
  
  try {
    // Test 1: Direct image generation
    console.log('\n--- Test 1: Direct image generation ---');
    const testDescription = "A magical forest with glowing mushrooms and a friendly fox";
    console.log('Generating image for description:', testDescription);
    
    const imageData = await generateImageForChapter(testDescription);
    console.log('Image generated successfully');
    console.log('Image data length:', imageData.length);
    console.log('Image starts with:', imageData.substring(0, 100));
    
    console.log('\n=== TEST COMPLETE ===');
    console.log('Check the console logs and debug-images directory for more details');
  } catch (error) {
    console.error('Error in test:', error);
  }
}

testImageGeneration();