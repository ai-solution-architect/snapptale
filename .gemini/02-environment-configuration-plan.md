# Environment Configuration Plan for AI Providers

This document outlines the plan to properly configure environment variables for both Ollama and Google AI providers, following Next.js conventions and Docker best practices.

## Current State Analysis

1. The project currently uses `.env.local` for local configuration (Next.js convention)
2. Recent changes introduced `.env.google` and `.env.google.example` files which contradict Next.js conventions
3. The README references `.env.google.example` but it wasn't initially present
4. Docker configuration uses environment files for security

## Issues Identified

1. **Inconsistency with Next.js conventions**: Using provider-specific files instead of `.env.local`
2. **File proliferation**: Multiple environment files instead of a single `.env.local`
3. **Documentation mismatch**: README references files that didn't exist
4. **Deviation from framework standards**: Next.js projects should use `.env.local` for local environment variables

## Proposed Solution

### 1. Align with Next.js Conventions

We should use `.env.local` which is the standard for Next.js applications, as per our project specification memory.

**Content for `.env.local`:**
```bash
# AI Provider Configuration
# Choose between 'ollama' (local) or 'google' (cloud)
AI_PROVIDER=ollama

# Google AI Configuration (used when AI_PROVIDER=google)
# Obtain your API key from Google AI Studio: https://aistudio.google.com/
GOOGLE_API_KEY=your-google-ai-api-key-here

# Ollama Configuration (used when AI_PROVIDER=ollama)
# No additional configuration needed for local Ollama setup
```

### 2. Update Example File

**Content for `.env.example`:**
```bash
# Environment variables for snapptale
# Copy this file to .env.local and customize the values

# AI Provider Configuration
# Choose between 'ollama' (local) or 'google' (cloud)
AI_PROVIDER=ollama

# Google AI Configuration (used when AI_PROVIDER=google)
# Obtain your API key from Google AI Studio: https://aistudio.google.com/
GOOGLE_API_KEY=your-google-ai-api-key-here

# Ollama Configuration (used when AI_PROVIDER=ollama)
# No additional configuration needed for local Ollama setup
```

### 3. Remove Provider-Specific Files

Delete the following files as they are not needed:
- `.env.google.example` (already done)
- Any references to provider-specific environment files

### 4. Update README Documentation

The README should be updated to reference `.env.local` instead of `.env.google`:

**Updated README Section:**
```markdown
#### 2.2.2 Configure Environment Variables

Create a `.env.local` file in the project root with your API key:

```bash
GOOGLE_API_KEY=your-google-ai-api-key-here
AI_PROVIDER=google
```

Alternatively, you can set these environment variables in your system or Docker configuration.

**Note:** Never commit `.env.local` files containing API keys to version control.
```

**Updated Docker Section:**
```markdown
### 4.2 Using Docker with Google AI

To use Google AI with Docker:

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` to add your actual API key:
   ```bash
   GOOGLE_API_KEY=your-google-ai-api-key-here
   AI_PROVIDER=google
   ```

2. Start the services:
   ```bash
   docker-compose up
   ```

**Security Note:** Using environment files is more secure than embedding secrets directly in docker-compose files. Never commit `.env.local` files containing API keys to version control.
```

### 5. Update Docker Compose Configuration

**Content for `docker-compose.override.yml.example`:**
```yaml
# Example override file for Google AI configuration
# Rename this file to docker-compose.override.yml to use Google AI

version: '3.8'

services:
  nextjs:
    # Use environment file for sensitive configuration (recommended)
    env_file:
      - .env.local
    
    # Alternative: Direct environment variables (less secure)
    # environment:
    #   - AI_PROVIDER=google
    #   - GOOGLE_API_KEY=your-google-ai-api-key-here

  # Note: No additional service is needed for Google AI as it's a cloud service
  # The ollama service can remain for local development or be disabled if not needed
```

## Implementation Steps

1. Update `.env.example` with the combined configuration
2. Remove any provider-specific environment files (`.env.google`, `.env.google.example`)
3. Update README to reference `.env.local` instead of provider-specific files
4. Update `docker-compose.override.yml.example` to reference `.env.local`
5. Ensure `.gitignore` properly excludes `.env.local`
6. Update any documentation that references provider-specific environment files

## Benefits of This Approach

1. **Follows Next.js conventions**: Uses `.env.local` as recommended by the framework
2. **Simplifies configuration**: Single file for all environment variables
3. **Reduces complexity**: Fewer files to manage
4. **Maintains security**: Still uses environment files for Docker
5. **Improves documentation**: Clear, consistent instructions
6. **Aligns with project specifications**: Follows our established Environment File Convention