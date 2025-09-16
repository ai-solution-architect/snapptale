// Mock URL.createObjectURL and URL.revokeObjectURL for Jest environment
global.URL.createObjectURL = jest.fn(() => 'mock-object-url');
global.URL.revokeObjectURL = jest.fn();

// Mock the fetch API
global.fetch = jest.fn((url, options) => {
  if (url === '/api/upload' && options.method === 'POST') {
    // This is a mock Base64 string for a tiny transparent PNG
    const mockImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    return Promise.resolve({
      json: () => Promise.resolve({ imageData: mockImageData, mimeType: 'image/png' }),
      ok: true,
      status: 200,
    });
  }
  // For any other fetch call, we now allow it to proceed to the real network.
  // This is crucial for the smoke test to work without interference.
  return jest.requireActual('node-fetch')(url, options);
});

afterEach(() => {
  global.fetch.mockClear();
});
