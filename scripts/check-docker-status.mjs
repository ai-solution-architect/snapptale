import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function checkDockerStatus() {
  try {
    console.log('Checking Docker status...');
    
    // Check if Docker is running
    await execPromise('docker info');
    
    // Check running containers
    const { stdout: containers } = await execPromise('docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"');
    console.log('Running containers:');
    console.log(containers);
    
    // Check if snapptale-ollama is running
    const { stdout: ollamaCheck } = await execPromise('docker ps | grep snapptale-ollama');
    if (ollamaCheck) {
      console.log('✓ Ollama container is running');
    } else {
      console.log('✗ Ollama container is not running');
    }
    
    // Check available models
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      if (response.ok) {
        const data = await response.json();
        console.log('Available models:');
        data.models.forEach(model => {
          console.log(`  - ${model.name}`);
        });
      } else {
        console.log('✗ Could not fetch model information');
      }
    } catch (error) {
      console.log('✗ Could not connect to Ollama API');
    }
    
  } catch (error) {
    console.error('Docker is not running or not accessible:', error.message);
    process.exit(1);
  }
}

checkDockerStatus();