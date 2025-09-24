# Multimodal Image Generation Refactor Plan

## Current Status Analysis

### What's Already Implemented
- [x] **Image Description Generation**: The [generateImageDescription](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L43-L80) function can analyze images and generate descriptions using Google AI with `gemini-2.5-flash` (correct model for this task)
- [x] **Personalized Image Generation**: The [generatePersonalizedImage](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L82-L118) function has Google AI integration but:
  - Uses `gemini-2.5-flash` instead of `gemini-2.5-flash-image-preview`
  - Returns placeholder images instead of extracting actual generated images
- [x] **Chapter Image Generation**: The [generateImageForChapter](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L17-L24) function only returns placeholder images
- [x] **AI Provider Abstraction**: All functions support switching between providers via [AI_PROVIDER](file:///Users/jonatassouza/Repositories/personal/snapptale/.env.example#L3-L4) environment variable
- [x] **Error Handling**: Basic error handling with fallback to placeholder images
- [x] **Testing**: Comprehensive test suite with mocks for AI services

### Issues Identified
1. **Model Names**: 
   - [generateImageDescription](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L43-L80) correctly uses `gemini-2.5-flash` for text/image analysis
   - [generatePersonalizedImage](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L82-L118) incorrectly uses `gemini-2.5-flash` instead of `gemini-2.5-flash-image-preview`
   - [generateImageForChapter](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L17-L24) is not implemented for Google AI
2. **Response Modalities**: Not setting `responseModalities` to include "Image" for image generation functions
3. **Image Extraction**: Not properly extracting image data from responses in image generation functions
4. **Placeholder Images**: Returning placeholder images instead of actual generated images in image generation functions

## Refactor Goals

### Primary Goals
1. **Correct Model Usage**: 
   - Keep `gemini-2.5-flash` for [generateImageDescription](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L43-L80) (text/image analysis)
   - Use `gemini-2.5-flash-image-preview` for [generatePersonalizedImage](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L82-L118) and [generateImageForChapter](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L17-L24) (image generation)
2. **Proper Image Generation**: Implement actual image generation using the correct Google AI API methods
3. **Image Extraction**: Properly extract image data from Google AI responses
4. **Robust Error Handling**: Maintain graceful degradation with placeholder images when AI services fail
5. **Maintain Compatibility**: Keep the existing API interface unchanged

### Secondary Goals
1. **Code Reuse**: Extract common functionality into shared helper functions
2. **Test Coverage**: Ensure all paths are properly tested
3. **Documentation**: Update comments to reflect actual implementation

## Baby Step 1: Refactor generateImageForChapter for Proper Image Generation

### Goal: Implement proper image generation in [generateImageForChapter](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L17-L24) using correct Google AI API methods

**Baby Step 1 - Red Phase**:
- [x] Add a test that verifies [generateImageForChapter](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L17-L24) calls Google AI with correct model and extracts image data in [tests/ai/image.test.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/tests/ai/image.test.ts)
- [x] Run the test and verify it fails because our current implementation returns placeholder images

**Baby Step 2 - Green Phase**:
- [x] Update the [generateImageForChapter](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L17-L24) function in [src/lib/ai/image.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts) to:
  - Use the correct model name (`gemini-2.5-flash-image-preview`)
  - Set `responseModalities` to include "Image"
  - Extract image data from the response
  - Return actual generated images instead of placeholders
- [x] Run the test and verify it passes

**Baby Step 3 - Document and Commit**:
- [x] Update documentation
- [x] Commit changes

## Baby Step 2: Refactor generatePersonalizedImage for Proper Image Generation

### Goal: Implement proper image generation in [generatePersonalizedImage](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L82-L118) using correct Google AI API methods

**Baby Step 1 - Red Phase**:
- [x] Update existing test to verify [generatePersonalizedImage](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L82-L118) calls Google AI with correct model and extracts image data in [tests/ai/image.test.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/tests/ai/image.test.ts)
- [x] Run the test and verify it fails because our current implementation uses wrong model and returns placeholder images

**Baby Step 2 - Green Phase**:
- [x] Update the [generatePersonalizedImage](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L82-L118) function in [src/lib/ai/image.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts) to:
  - Use the correct model name (`gemini-2.5-flash-image-preview`)
  - Set `responseModalities` to include "Image"
  - Extract image data from the response
  - Return actual generated images instead of placeholders
- [x] Run the test and verify it passes

**Baby Step 3 - Document and Commit**:
- [x] Update documentation
- [x] Commit changes

## Baby Step 3: Extract Common Functionality

### Goal: Extract common Google AI initialization and error handling into shared helper functions

**Baby Step 1 - Red Phase**:
- [x] Add a test that verifies the existence of helper functions for Google AI initialization in [tests/ai/image.test.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/tests/ai/image.test.ts)
- [x] Run the test and verify it fails because the helper functions don't exist

**Baby Step 2 - Green Phase**:
- [x] Create helper functions in [src/lib/ai/image.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts) for:
  - Initializing Google AI with correct model and configuration
  - Extracting image data from responses
  - Handling common error cases
- [x] Update all three image generation functions to use these helpers
- [x] Run the test and verify it passes

**Baby Step 3 - Document and Commit**:
- [x] Update documentation
- [x] Commit changes

## Implementation Status

### Completed Functions:
- [x] [generateImageDescription](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L43-L80) - Properly implemented with correct model
- [x] [generateImageForChapter](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L17-L24) - Now properly implemented with Google AI
- [x] [generatePersonalizedImage](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L82-L118) - Now properly implemented with Google AI
- [x] Extract common functionality into helper functions

### Functions to Refactor:
- [ ] Update all tests for comprehensive coverage

## File Structure Changes

```
src/
  lib/
    ai/
      image.ts          # Refactored image generation functions with proper multimodal support
tests/
  ai/
    image.test.ts       # Updated tests with proper image generation verification
```

## Testing Strategy

- [x] **Unit Tests**: Test each function in isolation with mocks
- [ ] **Image Extraction Tests**: Verify proper extraction of image data from responses
- [ ] **Model Verification Tests**: Verify correct model names are used
- [ ] **Error Handling Tests**: Test error conditions and fallback behavior

## Success Criteria

### Functional
- [x] [generateImageForChapter](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L17-L24) properly generates images using Google AI with `gemini-2.5-flash-image-preview`
- [x] [generatePersonalizedImage](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L82-L118) properly generates images using Google AI with `gemini-2.5-flash-image-preview`
- [x] [generateImageDescription](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L43-L80) continues to work correctly with `gemini-2.5-flash`
- [x] Image data is properly extracted from responses
- [x] Common functionality extracted into helper functions
- [ ] Graceful degradation to placeholder images when AI services fail

### Reliability
- [x] All tests pass
- [ ] Error handling for AI service failures
- [x] Consistent behavior across all functions

## Alignment with Project Principles

This refactor plan adheres to the core principles outlined in [prepare-chat-prompt.md](file:///Users/jonatassouza/Repositories/personal/snapptale/.gemini/prepare-chat-prompt.md) and [GEMINI.md](file:///Users/jonatassouza/Repositories/personal/snapptale/GEMINI.md):

1. **Confirm Significant Actions**: All significant changes will require explicit user permission before implementation.
2. **Adhere to Project Conventions**: All modifications will strictly follow existing project conventions.
3. **Test-Driven Approach**: Following the strict TDD baby steps for all refactoring.
4. **User Control**: Implementation will not proceed beyond the clear scope of user requests without confirmation.
5. **Documentation Accuracy**: Documentation will reflect only what is actually implemented.