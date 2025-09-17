import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFiles: ['<rootDir>/tests/jest.setup.js'], // Load environment variables explicitly
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/tests/setupTests.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  moduleNameMapper: {
    // Handle module aliases (this is the important part)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

// Export an async function so we can modify the config dynamically
export default async () => {
  // Create the base Jest config
  const jestConfig = await createJestConfig(customJestConfig)();

  // Add our custom transformIgnorePatterns
  // This pattern tells Jest to NOT ignore @google/genai when transforming modules.
  jestConfig.transformIgnorePatterns = [
    '/node_modules/(?!@google/genai)/',
    // This is the default pattern from next/jest, which we need to preserve.
    '^.+\\.module\\.(css|sass|scss)$'
  ];

  return jestConfig;
};
