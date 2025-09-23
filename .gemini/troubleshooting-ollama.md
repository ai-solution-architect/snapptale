# Troubleshooting Ollama Issues

This guide helps you resolve common issues with the Ollama setup in Snapptale.

## Common Issues and Solutions

### 1. Timeout Errors When Generating Stories

**Symptom**: 
```
Upload API Error: TypeError: fetch failed
[cause]: [Error [HeadersTimeoutError]: Headers Timeout Error]
```

**Causes and Solutions**:
1. **Large Image Size**: The image you're uploading might be too large for Ollama to process in a reasonable time.
   - Solution: Try uploading a smaller image (under 5MB)
   - Our application now checks for file size and rejects images larger than 5MB

2. **Insufficient Resources**: Ollama might not have enough memory or CPU to process the request.
   - Solution: Check the resource allocation in [docker-compose.yml](file:///Users/jonatassouza/Repositories/personal/snapptale/docker-compose.yml)
   - We've allocated 4GB reserved memory and 8GB maximum memory for the Ollama container

3. **Model Not Loaded**: The llava model might not be properly loaded.
   - Solution: Restart the Docker containers:
     ```bash
     docker-compose down
     docker-compose up -d
     ```

### 2. Connection Refused Errors

**Symptom**: 
```
Error: connect ECONNREFUSED 127.0.0.1:11434
```

**Causes and Solutions**:
1. **Ollama Container Not Running**: 
   - Check if the container is running:
     ```bash
     docker ps | grep ollama
     ```
   - If not running, start it:
     ```bash
     docker-compose up -d
     ```

2. **Port Not Exposed**: 
   - Verify that port 11434 is properly mapped in [docker-compose.yml](file:///Users/jonatassouza/Repositories/personal/snapptale/docker-compose.yml)
   - Restart the containers after any changes to the Docker Compose file

### 3. Model Not Found Errors

**Symptom**: 
```
Upload API Error: Error: Ollama API request failed: Not Found
```

**Causes and Solutions**:
1. **Wrong Model Configuration**: You might have configured a model that doesn't exist or doesn't support image processing.
   - Solution: Check your [.env.local](file:///Users/jonatassouza/Repositories/personal/snapptale/.env.local) file and ensure you're using a vision model like `llava`
   - The `gemma:3b` model is a text-only model and cannot process images

2. **Model Not Pulled**: The model you specified might not be installed.
   - Solution: Pull the correct model:
     ```bash
     docker exec snapptale-ollama ollama pull llava
     ```

### 4. Model Not Available

**Symptom**: 
```
Error: The model 'gemma:3b' is not available.
```

**Causes and Solutions**:
1. **Using Text-Only Models for Image Processing**: Text-only models like `gemma:3b` cannot process images.
   - Solution: Use a vision model like `llava` which is designed for image processing tasks

## Testing Your Setup

You can test your Ollama setup using our built-in scripts:

1. **Basic connectivity test**:
   ```bash
   npm run test-ollama
   ```

2. **Complete setup verification**:
   ```bash
   npm run verify-ollama
   ```

3. **Docker status check**:
   ```bash
   npm run check-docker
   ```

These scripts will:
1. Check if the Ollama API is accessible
2. List the available models
3. Verify your environment configuration
4. Report any connectivity issues

## Performance Optimization Tips

1. **Image Size**: Keep uploaded images under 5MB for best performance
2. **Resource Allocation**: Ensure your Docker has sufficient resources allocated
3. **Model Management**: Keep only the models you need to reduce memory usage

## Getting More Help

If you continue to experience issues:

1. Check the Ollama container logs:
   ```bash
   docker logs snapptale-ollama
   ```

2. Verify the model is working with a simple test:
   ```bash
   curl http://localhost:11434/api/tags
   ```

3. Restart the entire setup:
   ```bash
   docker-compose down
   docker-compose up -d
   ```