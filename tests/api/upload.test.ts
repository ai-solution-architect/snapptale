// tests/api/upload.test.ts

/**
 * @file Test suite for the upload API endpoint.
 */

import { TextEncoder } from 'util';

// Mock the AI service
jest.mock('@/lib/ai', () => ({
  generateStory: jest.fn().mockResolvedValue({
    story: [
      {
        chapter: 1,
        title: 'Test Chapter',
        text: 'Test story text',
        illustration_description: 'Test illustration',
        imageData: 'test-image-data',
        mimeType: 'image/png',
      },
    ],
  }),
}));

// Mock NextResponse
const mockJson = jest.fn();
const NextResponse = {
  json: mockJson,
};

// Mock the module
jest.mock('next/server', () => ({
  NextResponse: {
    json: mockJson,
  },
}));

// Import after mocks are set up
const { POST } = require('@/app/api/upload/route');

describe('/api/upload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the generateStory service with form data', async () => {
    // Create a mock formData object
    const mockFormData = {
      get: jest.fn((key) => {
        if (key === 'name') return 'Test Child';
        if (key === 'photo') {
          const photoContent = 'test content';
          return {
            name: 'test.png',
            type: 'image/png',
            size: photoContent.length,
            arrayBuffer: () =>
              Promise.resolve(new TextEncoder().encode(photoContent).buffer),
          } as File;
        }
        return null;
      }),
    };

    // Create a mock request object
    const mockRequest = {
      formData: jest.fn().mockResolvedValue(mockFormData),
    };

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith({
      story: [
        {
          chapter: 1,
          title: 'Test Chapter',
          text: 'Test story text',
          illustration_description: 'Test illustration',
          imageData: 'test-image-data',
          mimeType: 'image/png',
        },
      ],
    });
  });

  it('should reject files larger than 5MB', async () => {
    // Create a mock formData object with a large file
    const mockFormData = {
      get: jest.fn((key) => {
        if (key === 'name') return 'Test Child';
        if (key === 'photo') {
          // Create a mock file larger than 5MB (6MB)
          const largeFileSize = 6 * 1024 * 1024;
          return {
            name: 'large-image.jpg',
            type: 'image/jpeg',
            size: largeFileSize,
            arrayBuffer: () =>
              Promise.resolve(new Uint8Array(largeFileSize).fill(0).buffer),
          } as File;
        }
        return null;
      }),
    };

    // Create a mock request object
    const mockRequest = {
      formData: jest.fn().mockResolvedValue(mockFormData),
    };

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith(
      {
        error: 'File too large',
        details: 'Please upload an image smaller than 5MB.',
      },
      { status: 400 }
    );
  });
});