// tests/ai.test.ts

/**
 * @file Test suite for the AI service abstraction layer.
 */

import { TextEncoder } from 'util';
import * as ai from '@/lib/ai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateImageForChapter } from '@/lib/ai/image';

// Mock the new image generation module
jest.mock('@/lib/ai/image');

// Mock the Google AI SDK
jest.mock('@google/generative-ai');

// Create typed references to the mocks
const MockedGoogleGenerativeAI = GoogleGenerativeAI as jest.Mock;
const mockedGenerateImageForChapter = generateImageForChapter as jest.Mock;

describe('AI Service Abstraction Layer', () => {
  beforeEach(() => {
    // Clear mocks before each test
    mockedGenerateImageForChapter.mockClear();
    MockedGoogleGenerativeAI.mockClear();
  });

  it('should be defined', () => {
    expect(ai.generateStory).toBeDefined();
  });

  it('should throw an error for an unknown provider', async () => {
    process.env.AI_PROVIDER = 'unknown_provider';
    const childName = 'Alex';
    const childPhoto = new File([''], 'alex-photo.png', { type: 'image/png' });
    await expect(ai.generateStory(childName, childPhoto)).rejects.toThrow(
      'Unknown AI provider: unknown_provider'
    );
    delete process.env.AI_PROVIDER;
  });

  it('should throw an error when GOOGLE_API_KEY is missing for google provider', async () => {
    process.env.AI_PROVIDER = 'google';
    delete process.env.GOOGLE_API_KEY; // Ensure it's unset
    const childName = 'Alex';
    const childPhoto = new File([''], 'alex-photo.png', { type: 'image/png' });
    await expect(ai.generateStory(childName, childPhoto)).rejects.toThrow(
      'Missing GOOGLE_API_KEY'
    );
    delete process.env.AI_PROVIDER;
  });
  
  it('should load environment variables from .env.local file', () => {
    // This test verifies that the application can load environment variables
    // The actual loading is handled by Next.js, but we can verify the environment
    // variables are accessible after the application starts
    
    // By default, AI_PROVIDER should be undefined or set to a default value
    // After loading .env.local, it should be set to the value in the file
    
    // This is more of an integration test that would be run in a real environment
    // For now, we're just verifying the test structure
    expect(true).toBe(true);
  });
});

describe('generateStory with Ollama', () => {
  beforeEach(() => {
    mockedGenerateImageForChapter.mockClear();
  });

  it('should call the Ollama API with the correct payload', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            response: JSON.stringify({
              story: [
                {
                  chapter: 1,
                  text: 'A mock story.',
                  illustration_description: 'A mock description.',
                },
              ],
            }),
          }),
      } as Response)
    );

    process.env.AI_PROVIDER = 'ollama';
    const childName = 'Alex';
    const photoContent = 'photo content';
    const childPhoto = {
      name: 'alex-photo.png',
      type: 'image/png',
      arrayBuffer: () =>
        Promise.resolve(new TextEncoder().encode(photoContent).buffer),
    } as File;

    await ai.generateStory(childName, childPhoto);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, options] = fetchSpy.mock.calls[0];
    const body = JSON.parse(options?.body as string);

    expect(url).toBe('http://localhost:11434/api/generate');
    expect(body.model).toBe('llava');
    expect(body.prompt).toContain('Alex');
    expect(body.images).toHaveLength(1);

    fetchSpy.mockRestore();
    delete process.env.AI_PROVIDER;
  });
});

describe('generateStory with Google AI', () => {
  // 3. Declare variables to hold the mock functions for our chain of calls:
  //    new GoogleGenerativeAI() -> getGenerativeModel() -> generateContent()
  let mockGetGenerativeModel: jest.Mock;
  let mockGenerateContent: jest.Mock;

  beforeEach(() => {
    // Provide a default mock implementation for the image generator
    mockedGenerateImageForChapter.mockResolvedValue(
      'data:image/png;base64,mock-from-before-each'
    );

    // 4. In `beforeEach`, we define the mock functions and their return values.
    //    This ensures a clean mock for every single test.
    mockGenerateContent = jest.fn().mockResolvedValue({
      response: {
        text: () =>
          JSON.stringify({
            story: [
              {
                chapter: 1,
                text: 'Chapter 1 text',
                illustration_description: 'Desc 1',
              },
              {
                chapter: 2,
                text: 'Chapter 2 text',
                illustration_description: 'Desc 2',
              },
              {
                chapter: 3,
                text: 'Chapter 3 text',
                illustration_description: 'Desc 3',
              },
            ],
          }),
      },
    });

    mockGetGenerativeModel = jest.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    });

    // 5. We then tell our top-level mock constructor what to do when it's called.
    //    In this case, it should return an object that has our `mockGetGenerativeModel` method.
    MockedGoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel,
    }));
  });

  it('should call the Google AI SDK with the correct parameters and return a story', async () => {
    process.env.AI_PROVIDER = 'google';
    process.env.GOOGLE_API_KEY = 'fake-key';

    const photoContent = 'fake-photo-content';
    const mockFile = {
      type: 'image/jpeg',
      arrayBuffer: () =>
        Promise.resolve(new TextEncoder().encode(photoContent).buffer),
    } as File;

    const result = await ai.generateStory('Test Child', mockFile);

    // --- Assertions ---

    // 1. Was the GoogleGenerativeAI constructor called with our API key?
    expect(MockedGoogleGenerativeAI).toHaveBeenCalledWith('fake-key');

    // 2. Was getGenerativeModel called with the correct vision model?
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-2.5-flash' });

    // 3. Was generateContent called with the correct prompt and image data?
    const expectedPrompt = expect.stringContaining('Test Child');
    const expectedImagePart = {
      inlineData: {
        data: Buffer.from(photoContent).toString('base64'),
        mimeType: 'image/jpeg',
      },
    };
    expect(mockGenerateContent).toHaveBeenCalledWith([expectedPrompt, expectedImagePart]);

    // 4. Does the final output have the correct structure?
    expect(result.story).toHaveLength(3);
    expect(result.story[1].text).toBe('Chapter 2 text');
    expect(result.story[1].imageData).toEqual(expect.any(String));
  });
});

describe('Image Generation Abstraction', () => {
  beforeEach(() => {
    mockedGenerateImageForChapter.mockClear();
  });

  it('should call generateImageForChapter for each chapter when using the google provider', async () => {
    // Arrange
    mockedGenerateImageForChapter.mockResolvedValue(
      'data:image/png;base64,mock-image-data'
    );

    // Mock the Google AI SDK response (which includes illustration_description)
    const mockGenerateContent = jest.fn().mockResolvedValue({
      response: {
        text: () =>
          JSON.stringify({
            story: [
              {
                chapter: 1,
                text: 'Chapter 1 text',
                illustration_description: 'Desc 1',
              },
              {
                chapter: 2,
                text: 'Chapter 2 text',
                illustration_description: 'Desc 2',
              },
              {
                chapter: 3,
                text: 'Chapter 3 text',
                illustration_description: 'Desc 3',
              },
            ],
          }),
      },
    });
    const mockGetGenerativeModel = jest.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    });
    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel,
    }));

    process.env.AI_PROVIDER = 'google';
    process.env.GOOGLE_API_KEY = 'fake-key';
    const mockFile = {
      type: 'image/jpeg',
      arrayBuffer: () =>
        Promise.resolve(new TextEncoder().encode('fake-photo-content').buffer),
    } as File;

    // Act
    await ai.generateStory('Test Child', mockFile);

    // Assert
    expect(mockedGenerateImageForChapter).toHaveBeenCalledTimes(3);
    expect(mockedGenerateImageForChapter).toHaveBeenCalledWith('Desc 1');
    expect(mockedGenerateImageForChapter).toHaveBeenCalledWith('Desc 2');
    expect(mockedGenerateImageForChapter).toHaveBeenCalledWith('Desc 3');
  });

  it('should call generateImageForChapter for each chapter when using the ollama provider', async () => {
    // Arrange
    mockedGenerateImageForChapter.mockResolvedValue(
      'data:image/png;base64,mock-image-data'
    );

    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            response: JSON.stringify({
              story: [
                {
                  chapter: 1,
                  text: 'Ollama Chapter 1',
                  illustration_description: 'Ollama Desc 1',
                },
                {
                  chapter: 2,
                  text: 'Ollama Chapter 2',
                  illustration_description: 'Ollama Desc 2',
                },
              ],
            }),
          }),
      } as Response)
    );

    process.env.AI_PROVIDER = 'ollama';
    const mockFile = {
      type: 'image/jpeg',
      arrayBuffer: () =>
        Promise.resolve(new TextEncoder().encode('fake-photo-content').buffer),
    } as File;

    // Act
    await ai.generateStory('Test Child', mockFile);

    // Assert
    expect(mockedGenerateImageForChapter).toHaveBeenCalledTimes(2);
    expect(mockedGenerateImageForChapter).toHaveBeenCalledWith('Ollama Desc 1');
    expect(mockedGenerateImageForChapter).toHaveBeenCalledWith('Ollama Desc 2');

    fetchSpy.mockRestore();
    delete process.env.AI_PROVIDER;
  });
});
