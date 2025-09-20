# Environment Configuration Implementation Plan

This document outlines the implementation plan for configuring environment variables for both Ollama and Google AI providers, following Next.js conventions and Docker best practices.

## Implementation Goal

Configure environment variables using Next.js conventions (`.env.local`) while maintaining Docker security best practices.

## Files to Create/Update

### 1. .env.example
Create this file with placeholder values to guide users:

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

### 2. README.md Updates
Update documentation to reference `.env.local`:

**Section 2.2.2 Configure Environment Variables:**
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

**Section 4.2 Using Docker with Google AI:**
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

### 3. docker-compose.override.yml.example
Update to reference `.env.local`:

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

1. Create `.env.example` with the content specified above
2. Update README.md sections to reference `.env.local` instead of provider-specific files
3. Update `docker-compose.override.yml.example` to reference `.env.local`
4. Verify `.gitignore` already excludes `.env.local` (it should based on current content)
5. Ensure all documentation consistently references `.env.local`

## Benefits of This Approach

1. **Follows Next.js conventions**: Uses `.env.local` as recommended by the framework
2. **Simplifies configuration**: Single file for all environment variables
3. **Maintains security**: Uses environment files for Docker configuration
4. **Improves consistency**: All documentation references the same file
5. **Reduces complexity**: Fewer files to manage