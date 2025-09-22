#!/usr/bin/env node

/**
 * Script to validate Docker Compose configuration
 * This script checks that the docker-compose.yml file contains the expected services
 * and documentation about Google AI configuration
 */

import { readFileSync } from 'fs';
import { load } from 'js-yaml';

try {
  // Read docker-compose.yml content as text to check for documentation
  const dockerComposeText = readFileSync('./docker-compose.yml', 'utf8');
  
  // Check for Google AI documentation
  if (!dockerComposeText.includes('Google AI') || !dockerComposeText.includes('GOOGLE_API_KEY')) {
    console.error('❌ Docker Compose file missing documentation about Google AI configuration');
    process.exit(1);
  }
  
  // Parse YAML to check services
  const dockerCompose = load(dockerComposeText);
  
  // Check that services exist
  if (!dockerCompose.services) {
    console.error('❌ No services found in docker-compose.yml');
    process.exit(1);
  }
  
  // Check that ollama service exists
  if (!dockerCompose.services.ollama) {
    console.error('❌ Ollama service not found in docker-compose.yml');
    process.exit(1);
  }
  
  console.log('✅ Docker Compose validation passed');
  console.log('   - Services found:', Object.keys(dockerCompose.services));
  console.log('   - Google AI documentation: Present');
  
} catch (error) {
  console.error('❌ Error validating Docker Compose configuration:', error.message);
  process.exit(1);
}