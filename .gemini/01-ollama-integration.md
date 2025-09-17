# Ollama Integration Plan

This document outlines the plan to integrate Ollama as a local AI provider for story generation, creating a decoupled and testable development environment.

**Note:** We will be following the strict TDD workflow defined in `GEMINI.md`.

## Phase 1: Set Up Ollama with Docker (Completed)

-   [x] Create a `docker-compose.yml` file to define the Ollama service.
-   [x] Start the Ollama container.
-   [x] Pull a multimodal AI model (e.g., `llava`) into the Ollama service.

## Phase 2: Create AI Service Abstraction Layer

**TDD Cycle 1: Establish the AI service module**

*   **Red Phase:** Created a new test file `tests/ai.test.ts`. The test `it('should be defined', ...)` was written to fail by attempting to import `generateStory` from the non-existent module `@/lib/ai`.
    *   *Status: Test failed as expected (`Cannot find module`).*
*   **Green Phase:** Created the file `src/lib/ai/index.ts` and exported a basic, empty `generateStory` function to make the test pass.
    *   *Status: Test passed.*
*   **Refactor/Doc:** The plan file was updated to reflect this cycle.
    *   *Status: Completed.*

-   [ ] Define a common interface or function signature for story generation that can be used by different providers.

## Phase 3: Implement Ollama Client

-   [ ] Implement the logic within `src/lib/ai/index.ts` to connect to the local Ollama service.
-   [ ] This implementation will handle the `fetch` request to the Ollama API endpoint.

## Phase 4: Refactor API Route and Finalize

-   [ ] Modify `src/app/api/upload/route.ts` to remove mock data.
-   [ ] Import and use the new AI abstraction service.
-   [ ] Use environment variables to control which AI provider is used (local Ollama vs. production Google AI).
-   [ ] Test the end-to-end functionality.
