# Ollama Integration Plan

This document outlines the plan to integrate Ollama as a local AI provider for story generation, creating a decoupled and testable development environment.

**Note:** We will be following the strict TDD workflow defined in `GEMINI.md`. Each cycle must be fully completed and checked off before the next begins.

## Phase 1: Set Up Ollama with Docker (Completed)

- [x] Create a `docker-compose.yml` file to define the Ollama service.
- [x] Start the Ollama container.
- [x] Pull a multimodal AI model (`llava`) into the Ollama service.

## Phase 2: Create AI Service Abstraction Layer (Completed)

- [x] **TDD Cycle 1: Establish the AI service module**
  - [x] Red: Wrote a failing test in `tests/ai.test.ts` to import a non-existent module.
  - [x] Green: Created `src/lib/ai/index.ts` with a basic export to pass the test.
  - [x] Doc: Updated this plan with the results of the cycle.
  - [x] Commit: `feat(ai): set up AI service module and initial test`

- [x] **TDD Cycle 2: Define the service function signature**
  - [x] Red: Wrote a failing test for an `async` function that throws a "not implemented" error.
  - [x] Green: Updated `generateStory` to be `async`, define its signature, and throw the expected error.
  - [x] Doc: Updated this plan with the results of the cycle.
  - [x] Commit: `feat(ai): define async signature for generateStory service`

## Phase 3: Implement Ollama Client

- [x] **TDD Cycle 3: Implement AI provider switch**
  - [x] Red: Wrote a failing test for the provider switch logic using an unknown provider.
  - [x] Green: Implemented the `switch` statement in `generateStory` to handle different providers.
  - [x] Doc: Updated the plan with a more granular, full-process structure.
  - [x] Commit: `feat(ai): implement provider switch for AI service`

- [x] **TDD Cycle 4: Implement the Ollama API call**
  - [x] Red: Wrote a failing test that mocks `fetch` and expects it to be called by the 'ollama' provider. -> **FAIL**
  - [x] Green: Implemented the `fetch` call logic in a `generateStoryWithOllama` function. Fixed test environment issues with `File` and `TextEncoder`. -> **PASS**
  - [x] Doc: Updated the plan with the results of the cycle.
  - [ ] Commit: Propose a commit message.

## Phase 4: Refactor API Route and Finalize

- [ ] **TDD Cycle 5: Refactor the API route to use the new AI service**
  - [ ] Red: Write a failing integration test for the API route `/api/upload`.
  - [ ] Green: Modify the route handler to call `generateStory` and remove mocks.
  - [ ] Doc: Update this plan with the results of the cycle.
  - [ ] Commit: Propose a commit message.