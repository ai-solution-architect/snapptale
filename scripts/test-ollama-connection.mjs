import fs from 'fs';

async function testOllamaConnection() {
  try {
    console.log('Testing Ollama connection...');
    
    // Test basic connectivity
    const response = await fetch('http://localhost:11434/api/tags');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Available models:', data.models.map(m => m.name));
    
    // Test with a small image if available
    console.log('Ollama connection test successful!');
  } catch (error) {
    console.error('Ollama connection test failed:', error.message);
    process.exit(1);
  }
}

testOllamaConnection();