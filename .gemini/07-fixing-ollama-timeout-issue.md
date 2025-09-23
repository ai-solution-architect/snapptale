# Fixing Ollama Timeout Issue

This document summarizes the changes made to fix the timeout issue when generating stories with Ollama.

## Problem

When users uploaded images and clicked "Generate Story", they encountered a timeout error:

```
Upload API Error: TypeError: fetch failed
[cause]: [Error [HeadersTimeoutError]: Headers Timeout Error]
```

This was happening because:

1. Large images were taking too long to process
2. The default timeout for fetch requests was too short
3. The Ollama service might not have had sufficient resources

## Solution

We implemented several fixes to resolve this issue:

### 1. Increased Fetch Timeout

In [src/lib/ai/index.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/src/lib/ai/index.ts), we added a timeout controller to extend the fetch timeout to 5 minutes:

```typescript
// Add a timeout controller for the fetch request
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes timeout

try {
  const response = await fetch('http://localhost:11434/api/generate', {
    signal: controller.signal,
  });
  // ... rest of the code ...
} catch (error) {
  clearTimeout(timeoutId);
  if (error instanceof Error && error.name === 'AbortError') {
    throw new Error('Ollama request timed out. The image might be too large or the model is taking too long to process.');
  }
  throw error;
}
```

### 2. Added Image Size Validation

In [src/app/api/upload/route.ts](file:///Users/jonatassouza/Repositories/personal/snapptale/src/app/api/upload/route.ts), we added validation to reject images larger than 5MB:

```typescript
// Check if the file is too large (more than 5MB)
if (file.size > 5 * 1024 * 1024) {
  return NextResponse.json({ 
    error: 'File too large', 
    details: 'Please upload an image smaller than 5MB.' 
  }, { status: 400 });
}
```

### 3. Optimized Docker Configuration

In [docker-compose.yml](file:///Users/jonatassouza/Repositories/personal/snapptale/docker-compose.yml), we added performance optimizations:

```yaml
environment:
  - OLLAMA_HOST=0.0.0.0
  - OLLAMA_ORIGINS=*
  - OLLAMA_KEEP_ALIVE=10m
# Add resource limits to prevent the container from consuming too much memory
deploy:
  resources:
    limits:
      memory: 8G
    reservations:
      memory: 4G
```

### 4. Added Testing Script

We created a test script to verify Ollama connectivity:

```bash
npm run test-ollama
```

### 5. Created Troubleshooting Guide

We created a comprehensive troubleshooting guide at [.gemini/troubleshooting-ollama.md](file:///Users/jonatassouza/Repositories/personal/snapptale/.gemini/troubleshooting-ollama.md) to help users resolve common issues.

## Testing

All existing tests continue to pass, confirming that our changes don't break existing functionality.

## Future Improvements

1. Implement actual image resizing before sending to Ollama
2. Add progress indicators for long-running operations
3. Implement retry logic for failed requests