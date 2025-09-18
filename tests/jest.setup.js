// tests/jest.setup.js
require('dotenv').config({ path: './.env.local' });

// Mock scrollIntoView for JSDOM environment, only if window is defined
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
}
