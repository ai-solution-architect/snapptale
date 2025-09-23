# Absolute Minimum Google AI Setup

This guide contains ONLY what is absolutely necessary to use Google AI with Snapptale. No optional steps, no extra files, no complexity.

## What You Actually Need

1. A Google AI API key from [Google AI Studio](https://aistudio.google.com/)
2. That's it. No other files or steps are required.

## Setup Steps

### Step 1: Configure Environment Variables

Create a `.env.local` file in the project root with your Google AI API key:

```bash
AI_PROVIDER=google
GOOGLE_API_KEY=your-actual-google-ai-api-key-here
```

### Step 2: Start the Application

```bash
npm run dev
```

### Step 3: Use the Application

1. Visit http://localhost:3000
2. Click "Go to Upload"
3. Upload a photo and enter a name
4. Click "Generate Story"
5. The story will be generated using Google AI

## How It Works

- When `AI_PROVIDER=google`, the application uses Google AI for story generation
- When `AI_PROVIDER=ollama` (default), the application uses Ollama
- The Ollama Docker service continues to run but is unused when using Google AI
- This doesn't cause any problems or conflicts

## Switching Back to Ollama

To switch back to Ollama, simply change your `.env.local` file:

```bash
AI_PROVIDER=ollama
# GOOGLE_API_KEY is not needed for Ollama
```

## That's Literally Everything

There are no other steps, no other files to create, no Docker Compose changes needed. Google AI works perfectly with just these simple steps.

The end.