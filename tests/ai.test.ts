// tests/ai.test.ts

/**
 * @file Test suite for the AI service abstraction layer.
 */

import { TextEncoder } from 'util';
import { generateStory } from '@/lib/ai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Mock the entire module. Jest will replace the real GoogleGenerativeAI
//    with a mock constructor.
jest.mock('@google/generative-ai');

// 2. Create a typed reference to the mocked constructor. This allows us to
//    control its behavior in our tests.
const MockedGoogleGenerativeAI = GoogleGenerativeAI as jest.Mock;

describe('AI Service Abstraction Layer', () => {
  // These tests do not involve the Google AI mock and can remain as they are.
  it('should be defined', () => {
    expect(generateStory).toBeDefined();
  });

  it('should throw an error for an unknown provider', async () => {
    process.env.AI_PROVIDER = 'unknown_provider';
    const childName = 'Alex';
    const childPhoto = new File([''], 'alex-photo.png', { type: 'image/png' });
    await expect(generateStory(childName, childPhoto)).rejects.toThrow(
      'Unknown AI provider: unknown_provider'
    );
    delete process.env.AI_PROVIDER;
  });

  it('should throw an error when GOOGLE_API_KEY is missing for google provider', async () => {
    process.env.AI_PROVIDER = 'google';
    delete process.env.GOOGLE_API_KEY; // Ensure it's unset
    const childName = 'Alex';
    const childPhoto = new File([''], 'alex-photo.png', { type: 'image/png' });
    await expect(generateStory(childName, childPhoto)).rejects.toThrow(
      'Missing GOOGLE_API_KEY'
    );
    delete process.env.AI_PROVIDER;
  });
});

describe('generateStory with Ollama', () => {
  it('should call the Ollama API with the correct payload', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          response: JSON.stringify({
            story: [{ chapter: 1, text: 'A mock story.', illustration_description: 'A mock description.' }]
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
      arrayBuffer: () => Promise.resolve(new TextEncoder().encode(photoContent).buffer),
    } as File;

    await generateStory(childName, childPhoto);

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
    // 4. In `beforeEach`, we define the mock functions and their return values.
    //    This ensures a clean mock for every single test.
    mockGenerateContent = jest.fn().mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          story: [
            { chapter: 1, text: 'Chapter 1 text', illustration_description: 'Desc 1' },
            { chapter: 2, text: 'Chapter 2 text', illustration_description: 'Desc 2' },
            { chapter: 3, text: 'Chapter 3 text', illustration_description: 'Desc 3' },
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
      arrayBuffer: () => Promise.resolve(new TextEncoder().encode(photoContent).buffer),
    } as File;

    const result = await generateStory('Test Child', mockFile);

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