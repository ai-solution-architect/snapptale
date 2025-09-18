/**
 * @jest-environment node
 */
// tests/api/upload.test.ts

import { POST } from '@/app/api/upload/route';
import { NextRequest } from 'next/server';
import { generateStory } from '@/lib/ai';

// Mock the entire AI service module.
// This allows us to isolate the API route and test its logic directly.
jest.mock('@/lib/ai', () => ({
  generateStory: jest.fn().mockResolvedValue({
    story: [
      {
        chapter: 1,
        text: 'Mock story chapter 1.',
        imageData: 'mockBase64Image1',
        mimeType: 'image/png',
      },
    ],
  }),
}));

describe('/api/upload', () => {
  // Clear mock history before each test to ensure a clean slate.
  beforeEach(() => {
    (generateStory as jest.Mock).mockClear();
  });

  it('should call the generateStory service with form data', async () => {
    // Arrange: Create a mock FormData object, just like a browser would send.
    const formData = new FormData();
    formData.append('name', 'Test Child');
    formData.append('photo', new Blob(['test file content']), 'test.png'); // Changed 'file' to 'photo'

    // Arrange: Create a mock NextRequest object to simulate a real request.
    const request = new NextRequest('http://localhost/api/upload', {
      method: 'POST',
      body: formData,
    });

    // Act: Call the POST handler directly with our mock request.
    await POST(request);

    // Assert: Check if our mocked generateStory function was called correctly.
    expect(generateStory).toHaveBeenCalledTimes(1);
    expect(generateStory).toHaveBeenCalledWith(
      'Test Child',
      expect.any(File) // The route handler reconstructs the File object from the FormData.
    );
  });

  
});
