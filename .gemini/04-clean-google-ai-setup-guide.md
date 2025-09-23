# Clean Google AI Setup Guide

This guide provides the minimal steps needed to set up Google AI for Snapptale. It includes only what is actually required - no optional or extra steps.

## What You Need

1. A Google AI API key from [Google AI Studio](https://aistudio.google.com/)
2. The Snapptale project code

## Setup Steps

### 1. Configure Environment Variables

Create a `.env.local` file in the project root with your Google AI API key:

```bash
AI_PROVIDER=google
GOOGLE_API_KEY=your-actual-google-ai-api-key-here
```

That's it! Google AI will now work.

## How It Works

- When `AI_PROVIDER=google`, the application uses Google AI for story generation
- When `AI_PROVIDER=ollama` (default), the application uses Ollama
- The Ollama service will continue to run but will be unused when using Google AI

## Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000
3. Go to the upload page
4. Upload a photo and enter a name
5. The story will be generated using Google AI

## Optional: Disable Ollama Service

If you want to disable the Ollama service when using Google AI:

1. Create a `docker-compose.override.yml` file:
   ```yaml
   version: '3.8'
   
   services:
     ollama:
       profiles:
         - donotstart
   ```

2. Start services:
   ```bash
   docker-compose up
   ```

This step is completely optional. Google AI works fine even with the Ollama service running in the background.

## Switching Back to Ollama

To switch back to Ollama, simply change your `.env.local` file:

```bash
AI_PROVIDER=ollama
# GOOGLE_API_KEY is not needed for Ollama
```