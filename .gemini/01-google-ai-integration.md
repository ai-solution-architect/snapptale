# Google AI Integration Guide

This document outlines the plan to integrate Google AI as a cloud-based provider for story generation, running parallel to the existing Ollama setup. We will use environment variables to control which provider is active.

**Coaching Note:** We will adhere strictly to the TDD workflow. Each step is a "baby step" designed to move us forward safely. We will write a failing test, make it pass with minimal code, and then refactor or document before committing.

---

## Phase 1: Configure Environment for Google AI

Our first step is to prepare the application to recognize the Google AI provider and its associated API key.

### TDD Cycle 1: Test for Google AI Provider Selection

- [ ] **Red:** In `tests/ai.test.ts`, write a new test that sets the `AI_PROVIDER` environment variable to `'google'`. The test should call `generateStory` and assert that it throws a specific "not implemented" error, confirming the `switch` statement directs to the correct, yet-to-be-built, logic.
- [ ] **Green:** The test should pass without any code changes, as this logic already exists in `src/lib/ai/index.ts`. This confirms our starting point.
- [ ] **Doc:** Update this guide to mark this cycle as complete.
- [ ] **Commit:** `test(ai): confirm google provider throws not implemented error`

### TDD Cycle 2: Test for Missing Google AI API Key

- [ ] **Red:** In `tests/ai.test.ts`, write a test where `AI_PROVIDER` is `'google'` but the `GOOGLE_API_KEY` environment variable is unset. Assert that calling `generateStory` throws a "Missing GOOGLE_API_KEY" error. This test will fail.
- [ ] **Green:** In `src/lib/ai/index.ts`, create a new (but currently empty) `generateStoryWithGoogle` function. In the `case 'google':` block, add a check for `process.env.GOOGLE_API_KEY` and throw the expected error if it's missing.
- [ ] **Doc:** Update this guide to mark this cycle as complete.
- [ ] **Commit:** `feat(ai): add guard for missing google api key`

---

## Phase 2: Implement the Google AI Client

Now we will build the core logic to communicate with the Google AI API using the `google-generative-ai` library.

### TDD Cycle 3: Install Google AI SDK

- [ ] **Action:** Run `npm install @google/generative-ai`. This step doesn't follow a typical Red-Green cycle but is a necessary prerequisite.
- [ ] **Doc:** Update this guide to mark this step as complete.
- [ ] **Commit:** `chore(deps): add @google/generative-ai sdk`

### TDD Cycle 4: Implement the Google AI API Call

- [ ] **Red:** In `tests/ai.test.ts`, write a new test for the `'google'` provider. Mock the `@google-generative-ai` library. Assert that the `GenerativeModel.generateContent` method is called with the correct prompt and image data. This test will fail.
- [ ] **Green:** In `src/lib/ai/index.ts`, implement the `generateStoryWithGoogle` function.
    - Initialize the Google AI client using the `GOOGLE_API_KEY`.
    - Prepare the prompt and image parts in the format required by the Google AI SDK.
    - Call `generateContent` and process the response to match the `StoryChapter` interface.
- [ ] **Doc:** Update this guide to mark this cycle as complete.
- [ ] **Commit:** `feat(ai): implement story generation with google ai`

---

## Phase 3: Refactor and Unify Image Handling

The current Ollama implementation uses a placeholder for image generation. The Google AI implementation will generate text and we will add a follow-up for image generation. To keep things consistent, we will create a unified function for this.

### TDD Cycle 5: Abstract Image Generation Logic

- [ ] **Red:** This is a refactoring step. We will first write an integration test. In `tests/ai.test.ts`, create a test that spies on a new, not-yet-created `generateImageForChapter` function and ensures it's called for each chapter by both `generateStoryWithOllama` and `generateStoryWithGoogle`.
- [ ] **Green:**
    - Create a new function `generateImageForChapter(illustration_description: string): Promise<string>` that returns a placeholder image for now.
    - Refactor both `generateStoryWithOllama` and `generateStoryWithGoogle` to call this new function for each chapter instead of having their own placeholder logic.
- [ ] **Doc:** Update this guide to mark this cycle as complete.
- [ ] **Commit:** `refactor(ai): abstract image generation into a unified function`

---

## Phase 4: Docker Configuration for Development

To ensure consistent development environments and simplify setup, we'll add Google AI configuration to our Docker Compose setup.

### TDD Cycle 6: Environment Configuration Management

- [ ] **Red:** Create a test that verifies the application can load environment variables from a `.env` file for Google AI configuration.
- [ ] **Green:** 
    - Create a `.env.example` file with placeholder values for `GOOGLE_API_KEY` and `AI_PROVIDER`
    - Update the Docker Compose configuration to support environment variable injection
    - Document how to properly configure environment variables for both Ollama and Google AI providers
- [ ] **Doc:** Update this guide to mark this cycle as complete.
- [ ] **Commit:** `feat(env): add environment configuration for google ai`

### TDD Cycle 7: Enhanced Docker Compose Configuration

- [ ] **Red:** Write a test that verifies the Docker Compose configuration includes both Ollama and Google AI services.
- [ ] **Green:**
    - Update `docker-compose.yml` to include documentation about Google AI configuration
    - Add volume mounts for environment files
    - Ensure the Docker Compose setup supports both local (Ollama) and cloud (Google AI) providers
- [ ] **Doc:** Update this guide to mark this cycle as complete.
- [ ] **Commit:** `feat(docker): enhance docker compose for google ai support`

---

## Phase 5: Environment Configuration Alignment

To align with Next.js conventions and simplify environment management, we will consolidate our environment configuration approach.

### TDD Cycle 8: Align with Next.js Conventions

- [ ] **Red:** Create a test that verifies the application works with `.env.local` instead of provider-specific environment files.
- [ ] **Green:** 
    - Update `.env.example` to include all necessary configuration options
    - Remove provider-specific environment files
    - Update documentation to reference `.env.local`
    - Ensure Docker configuration uses `.env.local`
- [ ] **Doc:** Update this guide and reference the detailed implementation plan in `02-environment-configuration-implementation.md`
- [ ] **Commit:** `feat(env): align environment configuration with next.js conventions`

### Environment Configuration Implementation Details

To ensure this guide contains all necessary information without requiring additional files, here are the implementation details for environment configuration:

#### 1. .env.example Content
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

#### 2. README.md Updates
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

#### 3. docker-compose.override.yml.example Content
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

#### Implementation Steps
1. Create `.env.example` with the content specified above
2. Update README.md sections to reference `.env.local` instead of provider-specific files
3. Update `docker-compose.override.yml.example` to reference `.env.local`
4. Verify `.gitignore` already excludes `.env.local` (it should based on current content)
5. Ensure all documentation consistently references `.env.local`

#### Benefits of This Approach
1. **Follows Next.js conventions**: Uses `.env.local` as recommended by the framework
2. **Simplifies configuration**: Single file for all environment variables
3. **Maintains security**: Uses environment files for Docker configuration
4. **Improves consistency**: All documentation references the same file
5. **Reduces complexity**: Fewer files to manage

---

## Phase 6: Final Verification

- [ ] **Manual Test:** Set the environment variables (`AI_PROVIDER='google'` and `GOOGLE_API_KEY='your-key'`) and run the application (`npm run dev`). Upload an image and name to verify that a story is generated successfully using Google AI.
- [ ] **Run Full Test Suite:** Execute `npm test` to ensure all existing and new tests pass, confirming that our changes haven't introduced any regressions.
- [ ] **Docker Test:** Run `docker-compose up` and verify that both Ollama and the Next.js application work correctly with Google AI configuration.