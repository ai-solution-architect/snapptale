// Mock URL.createObjectURL and URL.revokeObjectURL for Jest environment
global.URL.createObjectURL = jest.fn(() => 'mock-object-url');
global.URL.revokeObjectURL = jest.fn();
