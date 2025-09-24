# Multimodal Image Generation Refactor Plan

## Current Status Analysis

### What's Already Implemented
- [x] **Image Description Generation**: The [generateImageDescription](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L43-L80) function can analyze images and generate descriptions using Google AI
- [x] **Personalized Image Generation**: The [generatePersonalizedImage](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L82-L118) function can generate images from text prompts using Google AI (currently returns placeholders)
- [x] **Chapter Image Generation**: The [generateImageForChapter](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L17-L24) function returns placeholder images
- [x] **AI Provider Abstraction**: All functions support switching between providers via [AI_PROVIDER](file:///Users/jonatassouza/Repositories/personal/snapptale/.env.example#L3-L4) environment variable
- [x] **Error Handling**: Basic error handling with fallback to placeholder images
- [x] **Testing**: Comprehensive test suite with mocks for AI services

### Issues Identified
1. **Model Names**: Using `gemini-2.5-flash` for everything instead of `gemini-2.5-flash-image-preview` for image generation
2. **Response Modalities**: Not setting `responseModalities` to include "Image" for image generation
3. **Image Extraction**: Not properly extracting image data from responses
4. **Placeholder Images**: Returning placeholder images instead of actual generated images
5. **Inconsistent Implementation**: Different levels of implementation across the three functions

## Refactor Goals

### Primary Goals
1. **Consistent Implementation**: Ensure all three image generation functions follow the same pattern
2. **Proper Image Generation**: Implement actual image generation using the correct Google AI API methods
3. **Correct Model Usage**: Use the appropriate model names for image generation
4. **Robust Error Handling**: Maintain graceful degradation with placeholder images when AI services fail
5. **Maintain Compatibility**: Keep the existing API interface unchanged

### Secondary Goals
1. **Code Reuse**: Extract common functionality into shared helper functions
2. **Test Coverage**: Ensure all paths are properly tested
3. **Documentation**: Update comments to reflect actual implementation

## Baby Step 1: Refactor generateImageForChapter for Proper Image Generation

### Goal: Implement proper image generation in [generateImageForChapter](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L17-L24) using correct Google AI API methods

**Baby Step 1 - Red Phase**:
- [ ] Add a test that verifies [generateImageForChapter](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L17-L24) extracts image data from Google AI response in [tests/ai/image.test.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/tests/ai/image.test.ts)
- [ ] Run the test and verify it fails because our current implementation returns placeholder images

**Baby Step 2 - Green Phase**:
- [ ] Update the [generateImageForChapter](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L17-L24) function in [src/lib/ai/image.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts) to:
  - Use the correct model name (`gemini-2.5-flash-image-preview`)
  - Set `responseModalities` to include "Image"
  - Extract image data from the response
  - Return actual generated images instead of placeholders
- [ ] Run the test and verify it passes

**Baby Step 3 - Document and Commit**:
- [ ] Update documentation
- [ ] Commit changes

## Baby Step 2: Refactor generatePersonalizedImage for Proper Image Generation

### Goal: Implement proper image generation in [generatePersonalizedImage](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L82-L118) using correct Google AI API methods

**Baby Step 1 - Red Phase**:
- [ ] Add a test that verifies [generatePersonalizedImage](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L82-L118) extracts image data from Google AI response in [tests/ai/image.test.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/tests/ai/image.test.ts)
- [ ] Run the test and verify it fails because our current implementation returns placeholder images

**Baby Step 2 - Green Phase**:
- [ ] Update the [generatePersonalizedImage](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L82-L118) function in [src/lib/ai/image.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts) to:
  - Use the correct model name (`gemini-2.5-flash-image-preview`)
  - Set `responseModalities` to include "Image"
  - Extract image data from the response
  - Return actual generated images instead of placeholders
- [ ] Run the test and verify it passes

**Baby Step 3 - Document and Commit**:
- [ ] Update documentation
- [ ] Commit changes

## Baby Step 3: Refactor generateImageDescription for Consistency

### Goal: Ensure [generateImageDescription](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L43-L80) uses the correct model name

**Baby Step 1 - Red Phase**:
- [ ] Add a test that verifies [generateImageDescription](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L43-L80) uses the correct model name in [tests/ai/image.test.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/tests/ai/image.test.ts)
- [ ] Run the test and verify it fails because our current implementation uses `gemini-2.5-flash` for image analysis

**Baby Step 2 - Green Phase**:
- [ ] Update the [generateImageDescription](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L43-L80) function in [src/lib/ai/image.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts) to use the correct model name (`gemini-2.5-flash`) for text generation
- [ ] Run the test and verify it passes

**Baby Step 3 - Document and Commit**:
- [ ] Update documentation
- [ ] Commit changes

## Baby Step 4: Extract Common Functionality

### Goal: Extract common Google AI initialization and error handling into shared helper functions

**Baby Step 1 - Red Phase**:
- [ ] Add a test that verifies the existence of helper functions for Google AI initialization in [tests/ai/image.test.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/tests/ai/image.test.ts)
- [ ] Run the test and verify it fails because the helper functions don't exist

**Baby Step 2 - Green Phase**:
- [ ] Create helper functions in [src/lib/ai/image.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts) for:
  - Initializing Google AI with correct model and configuration
  - Extracting image data from responses
  - Handling common error cases
- [ ] Update all three image generation functions to use these helpers
- [ ] Run the test and verify it passes

**Baby Step 3 - Document and Commit**:
- [ ] Update documentation
- [ ] Commit changes

## Baby Step 5: Update All Tests for Consistency

### Goal: Ensure all tests properly verify image generation functionality

**Baby Step 1 - Red Phase**:
- [ ] Add tests that verify proper image extraction for all functions in [tests/ai/image.test.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/tests/ai/image.test.ts)
- [ ] Run the tests and verify some fail due to missing verification

**Baby Step 2 - Green Phase**:
- [ ] Update all tests in [tests/ai/image.test.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/tests/ai/image.test.ts) to properly verify:
  - Correct model names are used
  - Response modalities are set correctly
  - Image data is properly extracted from responses
  - Error handling works correctly
- [ ] Run all tests and verify they pass

**Baby Step 3 - Document and Commit**:
- [ ] Update documentation
- [ ] Commit changes

## Implementation Status

### Completed Baby Steps:
- [ ] Baby Step 1: Refactor generateImageForChapter for Proper Image Generation
- [ ] Baby Step 2: Refactor generatePersonalizedImage for Proper Image Generation
- [ ] Baby Step 3: Refactor generateImageDescription for Consistency
- [ ] Baby Step 4: Extract Common Functionality
- [ ] Baby Step 5: Update All Tests for Consistency

### Current Implementation Plan
1. Start with [generateImageForChapter](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L17-L24) as it's the most straightforward function
2. Move to [generatePersonalizedImage](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L82-L118) which has similar requirements
3. Update [generateImageDescription](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/image.ts#L43-L80) for consistency
4. Extract common functionality into helper functions
5. Update all tests for comprehensive coverage

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
- [ ] **Error Handling Tests**: Test error conditions and fallback behavior
- [ ] **Model Configuration Tests**: Verify correct model names and configurations
- [ ] **Cross-Function Tests**: Ensure consistency across all three functions

## Success Criteria

### Functional
- [ ] All three image generation functions properly generate images using Google AI
- [ ] Correct model names and configurations are used
- [ ] Image data is properly extracted from responses
- [ ] Graceful degradation to placeholder images when AI services fail

### Performance
- [ ] Efficient initialization of Google AI clients
- [ ] Proper error handling without blocking
- [ ] Minimal code duplication

### Reliability
- [ ] All tests pass
- [ ] Error handling for AI service failures
- [ ] Consistent behavior across all functions

### Maintainability
- [ ] Clear code structure with extracted helpers
- [ ] Comprehensive test coverage
- [ ] Good documentation

## Alignment with Project Principles

This refactor plan adheres to the core principles outlined in [prepare-chat-prompt.md](file:///Users/jonatassouza/Repositories/personal/snapptale/.gemini/prepare-chat-prompt.md) and [GEMINI.md](file:///Users/jonatassouza/Repositories/personal/snapptale/GEMINI.md):

1. **Confirm Significant Actions**: All significant changes will require explicit user permission before implementation.
2. **Adhere to Project Conventions**: All modifications will strictly follow existing project conventions.
3. **Test-Driven Approach**: Following the strict TDD baby steps for all refactoring.
4. **User Control**: Implementation will not proceed beyond the clear scope of user requests without confirmation.
5. **Documentation Accuracy**: Documentation will reflect only what is actually implemented.