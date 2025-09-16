jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: jest.fn(() => ({
        response: {
          candidates: [{
            content: {
              parts: [{ text: 'Mocked content' }]
            }
          }]
        }
      })),
    })),
  })),
}));

describe('External Service Smoke Tests', () => {
  describe('Google AI API', () => {
    // This test checks if the GOOGLE_API_KEY environment variable is set.
    // For actual API connectivity, run `npm run check-google-ai`.
    it('should confirm GOOGLE_API_KEY is set', () => {
      if (!process.env.GOOGLE_API_KEY) {
        throw new Error('GOOGLE_API_KEY is not defined. Please set it in your environment.' +
                        ' For actual API connectivity, run `npm run check-google-ai`.');
      }
      // If the key is set, this test passes.
      console.log('GOOGLE_API_KEY is set. To verify API connectivity, run `npm run check-google-ai`.');
      expect(true).toBe(true);
    });
  });
});
