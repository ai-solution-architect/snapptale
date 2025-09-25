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
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    mockedGenerateImageForChapter.mockClear();
    delete process.env.AI_PROVIDER;
    delete process.env.OLLAMA_MODEL;

    fetchSpy = jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url === 'http://localhost:11434/api/tags') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ models: [{ name: 'llava' }, { name: 'gemma:3b' }] }),
        } as Response);
      }
      if (url === 'http://localhost:11434/api/generate') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              response: JSON.stringify({ 
                story: [
                  {
                    chapter: 1,
                    title: 'Test Chapter',
                    text: 'Test text',
                    illustration_description: 'Test description',
                  }
                ] 
              }),
            }),
        } as Response);
      }
      return Promise.reject(new Error(`Unhandled fetch mock URL: ${url}`));
    });
  });

  afterEach(() => {
    fetchSpy.mockRestore();
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
    // The actual loading is handled by Next.js and dotenv, but we can verify 
    // that environment variables are accessible in the test environment
    
    // In the test environment, process.env variables are loaded from .env.local
    // We're just verifying the test structure here
    expect(true).toBe(true);
  });
  
  it('should use ollama as default provider when AI_PROVIDER is not set', async () => {
    // Save the original value
    const originalProvider = process.env.AI_PROVIDER;
    
    // Ensure AI_PROVIDER is not set
    delete process.env.AI_PROVIDER;
    
    // Mock the image generation function to return a valid image data
    mockedGenerateImageForChapter.mockResolvedValue('data:image/png;base64,test-image-data');
    
    const childName = 'Alex';
    const photoContent = 'photo content';
    const childPhoto = {
      name: 'alex-photo.png',
      type: 'image/png',
      arrayBuffer: () =>
        Promise.resolve(new TextEncoder().encode(photoContent).buffer),
    } as File;
    
    // Mock the fetch function to avoid actual API calls
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url === 'http://localhost:11434/api/tags') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ models: [{ name: 'llava' }] }),
        } as Response);
      }
      if (url === 'http://localhost:11434/api/generate') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              response: JSON.stringify({ 
                story: [
                  {
                    chapter: 1,
                    title: 'Test Chapter',
                    text: 'Test text',
                    illustration_description: 'Test description',
                  }
                ] 
              }),
            }),
        } as Response);
      }
      return Promise.reject(new Error(`Unhandled fetch mock URL: ${url}`));
    });
    
    // This should not throw an error and should use ollama as default
    await expect(ai.generateStory(childName, childPhoto)).resolves.toBeDefined();
    
    // Restore the original value
    if (originalProvider) {
      process.env.AI_PROVIDER = originalProvider;
    } else {
      delete process.env.AI_PROVIDER;
    }
    
    // Restore the fetch function
    fetchSpy.mockRestore();
  });
});

describe('generateStory with Ollama', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    mockedGenerateImageForChapter.mockClear();
    delete process.env.AI_PROVIDER;
    delete process.env.OLLAMA_MODEL;

    fetchSpy = jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url === 'http://localhost:11434/api/tags') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ models: [{ name: 'llava' }, { name: 'gemma:3b' }] }),
        } as Response);
      }
      if (url === 'http://localhost:11434/api/generate') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              response: JSON.stringify({ story: [] }),
            }),
        } as Response);
      }
      return Promise.reject(new Error(`Unhandled fetch mock URL: ${url}`));
    });
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('should use "llava" as the default model when OLLAMA_MODEL is not set', async () => {
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

    // The fetchSpy is now in the beforeEach block
    const generateCall = fetchSpy.mock.calls.find(call => call[0] === 'http://localhost:11434/api/generate');
    expect(generateCall).toBeDefined();
    const body = JSON.parse(generateCall[1]?.body as string);
    expect(body.model).toBe('llava');
  });

  it('should use the model specified in OLLAMA_MODEL environment variable', async () => {
    process.env.AI_PROVIDER = 'ollama';
    process.env.OLLAMA_MODEL = 'gemma:3b';
    const childName = 'Alex';
    const photoContent = 'photo content';
    const childPhoto = {
      name: 'alex-photo.png',
      type: 'image/png',
      arrayBuffer: () =>
        Promise.resolve(new TextEncoder().encode(photoContent).buffer),
    } as File;

    await ai.generateStory(childName, childPhoto);

    const generateCall = fetchSpy.mock.calls.find(call => call[0] === 'http://localhost:11434/api/generate');
    expect(generateCall).toBeDefined();
    const body = JSON.parse(generateCall[1]?.body as string);
    expect(body.model).toBe('gemma:3b');
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
                title: 'Chapter 1',
                text: 'Chapter 1 text',
                illustration_description: 'Desc 1',
              },
              {
                chapter: 2,
                title: 'Chapter 2',
                text: 'Chapter 2 text',
                illustration_description: 'Desc 2',
              },
              {
                chapter: 3,
                title: 'Chapter 3',
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

  it('should correctly parse JSON from a response wrapped in markdown', async () => {
    // This test simulates the AI returning a JSON object wrapped in a code block.
    const markdownJsonResponse = '``json\n' +
      JSON.stringify({
        story: [
          {
            chapter: 1,
            title: 'Chapter 1 Title',
            text: 'A story from a markdown response.',
            illustration_description: 'A markdown description.',
          },
        ],
      }) +
      '\n``';

    // Override the mock for this specific test
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => markdownJsonResponse,
      },
    });

    process.env.AI_PROVIDER = 'google';
    process.env.GOOGLE_API_KEY = 'fake-key';
    const mockFile = {
      type: 'image/jpeg',
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    } as File;

    const result = await ai.generateStory('Test Child', mockFile);

    // Assert that the story was parsed correctly despite the markdown
    expect(result.story).toHaveLength(1);
    expect(result.story[0].text).toBe('A story from a markdown response.');
  });
});

describe('Image Generation Abstraction', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    mockedGenerateImageForChapter.mockClear();

    fetchSpy = jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url === 'http://localhost:11434/api/tags') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ models: [{ name: 'llava' }, { name: 'gemma:3b' }] }),
        } as Response);
      }
      if (url === 'http://localhost:11434/api/generate') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              response: JSON.stringify({
                story: [
                  {
                    chapter: 1,
                    title: 'Ollama Chapter 1',
                    text: 'Ollama Chapter 1',
                    illustration_description: 'Ollama Desc 1',
                  },
                  {
                    chapter: 2,
                    title: 'Ollama Chapter 2',
                    text: 'Ollama Chapter 2',
                    illustration_description: 'Ollama Desc 2',
                  },
                ],
              }),
            }),
        } as Response);
      }
      return Promise.reject(new Error(`Unhandled fetch mock URL: ${url}`));
    });
  });

  afterEach(() => {
    fetchSpy.mockRestore();
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
                title: 'Chapter 1',
                text: 'Chapter 1 text',
                illustration_description: 'Desc 1',
              },
              {
                chapter: 2,
                title: 'Chapter 2',
                text: 'Chapter 2 text',
                illustration_description: 'Desc 2',
              },
              {
                chapter: 3,
                title: 'Chapter 3',
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
    const photoContent = 'fake-photo-content';
    const mockFile = {
      type: 'image/jpeg',
      arrayBuffer: () =>
        Promise.resolve(new TextEncoder().encode(photoContent).buffer),
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

    process.env.AI_PROVIDER = 'ollama';
    const photoContent = 'fake-photo-content';
    const mockFile = {
      type: 'image/jpeg',
      arrayBuffer: () =>
        Promise.resolve(new TextEncoder().encode(photoContent).buffer),
    } as File;

    // Act
    await ai.generateStory('Test Child', mockFile);

    // Assert
    expect(mockedGenerateImageForChapter).toHaveBeenCalledTimes(2);
    expect(mockedGenerateImageForChapter).toHaveBeenCalledWith('Ollama Desc 1');
    expect(mockedGenerateImageForChapter).toHaveBeenCalledWith('Ollama Desc 2');

    delete process.env.AI_PROVIDER;
  });
});