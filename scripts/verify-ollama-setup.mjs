import fs from 'fs';

async function verifyOllamaSetup() {
  try {
    console.log('Verifying Ollama setup...');
    
    // Check if Ollama is running
    console.log('1. Checking if Ollama service is accessible...');
    const response = await fetch('http://localhost:11434/api/tags');
    if (!response.ok) {
      throw new Error(`Ollama service is not accessible. Status: ${response.status}`);
    }
    console.log('✓ Ollama service is running');
    
    // List available models
    console.log('2. Checking available models...');
    const data = await response.json();
    if (!data.models || data.models.length === 0) {
      console.log('⚠ No models found. You need to pull a model to use Ollama.');
      console.log('  Run: ollama pull llava');
      return;
    }
    
    console.log('Available models:');
    data.models.forEach(model => {
      console.log(`  - ${model.name} (${model.details?.parameter_size || 'unknown size'})`);
    });
    
    // Check for required models
    console.log('3. Checking for required models...');
    const hasLlava = data.models.some(model => model.name.includes('llava'));
    if (hasLlava) {
      console.log('✓ llava model is available (required for image processing)');
    } else {
      console.log('⚠ llava model is not available but is required for image processing');
      console.log('  Run: ollama pull llava');
    }
    
    // Check environment configuration
    console.log('4. Checking environment configuration...');
    if (fs.existsSync('.env.local')) {
      const envContent = fs.readFileSync('.env.local', 'utf8');
      const modelMatch = envContent.match(/OLLAMA_MODEL=(.*)/);
      if (modelMatch) {
        const configuredModel = modelMatch[1].trim();
        // Check if the configured model exists (exact match or partial match)
        const modelExists = data.models.some(model => 
          model.name === configuredModel || model.name.startsWith(configuredModel)
        );
        if (modelExists) {
          console.log(`✓ Configured model '${configuredModel}' is available`);
        } else {
          console.log(`⚠ Configured model '${configuredModel}' is not available`);
          console.log(`  Available models: ${data.models.map(m => m.name).join(', ')}`);
        }
      } else {
        console.log('✓ Using default model (llava)');
      }
    } else {
      console.log('✓ Using default configuration (no .env.local file)');
    }
    
    console.log('\n✓ Ollama setup verification completed successfully!');
    
  } catch (error) {
    console.error('❌ Ollama setup verification failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure Docker is running and the Ollama container is started');
    console.log('2. Run: docker-compose up -d');
    console.log('3. If you\'re using local Ollama instead of Docker, make sure the Ollama service is running');
    console.log('4. Check if the Ollama service is accessible at http://localhost:11434');
    process.exit(1);
  }
}

verifyOllamaSetup();