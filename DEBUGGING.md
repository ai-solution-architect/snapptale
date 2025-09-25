# Debugging Image Generation

This document explains how to debug the image generation process in Snapptale.

## Enhanced Logging

The image generation process now includes comprehensive logging at every step:

1. Image description generation
2. Personalized image generation
3. Story generation
4. Chapter image generation
5. Final story assembly

All logs are output to the console when running the development server, but only in development mode.

## Saving Generated Images for Validation

In development mode, generated images are automatically saved to the `debug-images` directory for validation:

1. Images are saved when extracted from AI responses
2. Images are saved when generated for chapters
3. Images are saved when generated as personalized images

The images are saved with timestamps in their filenames to avoid conflicts.

## Debugging Process

1. Ensure you're in development mode (NODE_ENV=development)

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Upload an image and generate a story through the UI

4. Check the console logs for detailed information about each step
   - Look for [DEBUG] messages
   - Look for [IMAGE PIPELINE DEBUG] messages
   - Look for [AI SERVICE DEBUG] messages
   - Look for [API ROUTE DEBUG] messages

5. Check the `debug-images` directory for saved images

6. If images appear broken:
   - Verify the base64 data is correctly formatted
   - Check that the MIME type is correct
   - Ensure the data URL prefix is properly formatted
   - Look for any error messages in the logs

## Log Analysis

When analyzing logs, pay special attention to:

1. Image data lengths - they should be non-zero for valid images
2. Image data prefixes - they should start with "data:image/..."
3. Error messages - any errors in the pipeline
4. Chapter image generation - ensure each chapter gets an image

## Manual Testing

You can also run the debug script directly:

```bash
npx ts-node debug-image-generation.ts
```

This will generate a test image and save it to the debug directory.

## Reducing API Calls During Debugging

To minimize API calls during debugging:

1. Use the MOCK_API_UPLOAD environment variable to test the frontend without AI calls
2. Check the debug-images directory for previously generated images
3. Look at the extensive logs to understand the flow without making additional calls