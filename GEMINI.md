# Gemini AI Assistant Context for Snapptale

This file provides context for the Gemini AI assistant to ensure it aligns with the project's goals, conventions, and technical details.

## 1. Project Overview

- **Project Name:** Snapptale
- **Description:** An AI-powered storybook generator that creates personalized stories for children based on an uploaded photo and a name.
- **Technologies:**
  - Next.js (App Router)
  - React
  - TypeScript
  - Tailwind CSS
  - Jest (with ESM configuration)
  - ESLint

## 2. Core MVP Features

- **Input:** User uploads a photo and provides a name.
- **Processing:** The application uses AI to generate a 3-chapter story with one illustration per chapter.
- **Output:** The final storybook is delivered as a downloadable PDF.
- **Safety:** All generated content is processed by a moderation service.

## 3. Development Workflow

### Scripts

- **Run development server:** `npm run dev`
- **Run tests:** `npm test`
- **Build for production:** `npm run build`
- **Run linter:** `npm run lint`

### Testing

- Tests are located in the `/tests` directory.
- We use Jest with `@testing-library/react`.
- Configuration is in `jest.config.mjs` and `tsconfig.json`.
- **Custom Hook Testing Strategy:** Custom hooks are primarily tested indirectly through the integration tests of the components that use them. Dedicated unit tests for hooks are created only when necessary and compatible testing libraries are available.

## 4. Future Goals

- Mobile application.
- More user customization (e.g., artistic styles, story length).
- Additional export formats (e.g., HTML, e-reader formats).
- A freemium/subscription model.

## 5. Coding Conventions

- **Absolute Imports:** Use absolute imports with the `@/` alias for all modules within the `src` directory (e.g., `import MyComponent from '@/components/MyComponent'`).
- **Component Naming:** Page components should be named with a `Page` suffix (e.g., `HomePage`, `UploadPage`).
- **Quote Style:** Use single quotes (`'`) for all JavaScript and TypeScript code.
- **Test Element Selection:** Prioritize user-facing attributes (e.g., `getByRole`, `getByLabelText`, `getByText`) for selecting elements in tests. Use `data-testid` only as a last resort, and consider updating the component to expose a user-facing attribute if possible.
- **Favor Custom Hooks for Business Logic:** When implementing complex business logic that involves state management (e.g., loading, error states) and side effects (e.g., API calls, file generation), encapsulate this logic within a custom hook (e.g., `useDataFetcher`, `usePdfExporter`). This separates concerns from the UI components, improves reusability, and simplifies testing by allowing the component and the hook logic to be tested in isolation.
- **Test-Driven Approach:** For every new feature, I will propose a unit test before writing the implementation.
- **Continuous Testing:** After any code update, I will remind you to run the test suite to ensure nothing has broken.
- **Source of Truth:** Our documentation (`GEMINI.md` and `.gemini/` files) and our tests are the primary source of truth. All code changes must be reflected in and validated by them.
- **Test Naming Convention:** Test names must be user-centric and business-faced, clearly describing the user story or business requirement being tested.
    *   **Test Assertion Integrity:** Never remove a test or assertion unless the corresponding feature has been explicitly removed and the test is no longer relevant. Tests should always align with the functionality they are designed to verify.
- **Testing for Expected Failures:** Treat predictable errors (e.g., API server unavailable, invalid user input, failed authentication) as distinct test cases, not as generic exceptions. Each expected failure mode should have its own test scenario that mocks the specific condition and asserts that the UI provides clear, user-friendly feedback appropriate to that error. Avoid broad `try...catch` blocks in tests that could mask the specific nature of a failure. The implementation should inspect response status codes and bodies to handle errors gracefully.

## 6. Documentation Notes

- The files in the `.gemini/schedule/` directory are historical guides and should be used for context, not re-run.

## 7. Development Guide (TDD Workflow)

To ensure a controlled and predictable development process, we will adhere to a strict Test-Driven Development (TDD) cycle for all new features and modifications.

The cycle is as follows:

(See also the "Enhanced TDD Baby Steps Rules for AI Assistant" in Section 8 for strict guidelines on adherence.)

1.  **Red Phase (Write a Failing Test):**
    *   Before writing any implementation code, I will first propose a test that targets a small, specific piece of functionality.
    *   The test will be focused and clearly define the expected behavior.
    *   We will run this test and expect it to fail.

2.  **Green Phase (Write Minimal Code):**
    *   I will then propose the absolute minimum amount of implementation code required to make the failing test pass.

3.  **Review and Refactor:**
    *   With the test passing, we can review the changes and refactor if necessary, ensuring the test remains green.

4.  **Business-Oriented Naming:**
    *   All tests and implementation code should use variable names that reflect the business domain (e.g., `childName`, `photoForStory` instead of `name`, `dummyFile`).
    *   Tests should be readable as a description of the feature's behavior from a user's perspective.

5.  **Document and Commit:**
    *   After each successful TDD cycle, I will remind you to consider if any updates are needed for our AI instructions (`GEMINI.md` or other `.gemini/` files).
    *   Following that, I will propose a clear and concise commit message to save the changes.

## 8. AI Interaction Guidelines

### Core Principles from Interaction Reminder
To reinforce safe, efficient, and user-controlled assistance (as outlined in `.gemini/prepare-chat-prompt.md`):
1. **Confirm Significant Actions:** Always seek explicit user permission before significant changes to the codebase, file system, or system state. Provide a clear plan and await approval.
2. **Adhere to Project Conventions:** Strictly follow conventions in `GEMINI.md` and the codebase.
3. **Explain Critical Commands:** Explain purpose and impact before any modifying shell commands.
4. **Prioritize User Control:** Do not exceed the scope of user requests without confirmation.
5. **Verify Before Acting:** Explicitly verify file contents and test results before proposals or actions.

- **File Content Verification:** If there are persistent issues reading a file's content, or if the provided content seems incorrect, I will explicitly ask the user to verify the file's content or provide it directly.
- **Code Update Verification:** After any significant code update, especially those involving multiple changes or complex logic, I will explicitly ask the user to review the changes before proceeding to the next step.
- **Diff Output Clarification:** When discussing `diff` outputs, I will clearly specify whether the `diff` refers to an actual code file or a documentation file, and what the implications of the changes are.
- **Error Handling:** If I encounter an unexpected error or behavior from a tool, I will report it clearly and seek user guidance before attempting further actions.
- **Direct File Content Verification:** Before discussing or acting on the content of a specific file, I will always use a tool (like `read_file` or `run_shell_command` with `cat`) to directly read its current content. I will not rely on memory or previous assumptions about file content.
- **Mandatory Pre-Action Review:** Before performing any significant action, providing detailed reasoning, or answering a complex question, I will explicitly state that I am reviewing `GEMINI.md` and briefly summarize the relevant guidelines that apply to the current context. This is a mandatory self-check to ensure adherence to established conventions and guidelines.
- **Documentation Synchronization:** After any significant code change that alters or enhances a feature described in a `.gemini/*.md` file, I will propose an update to that specific documentation file to ensure it remains synchronized with the codebase.
- **Strict Codebase State Verification:** Before discussing, analyzing, or proposing any changes to the codebase, I will perform a mandatory, explicit verification of the relevant file contents and test results. This verification, such as reading a file or checking test output, must be performed and its results shown immediately before I propose a code modification or provide a detailed analysis. I will not proceed until this verification is complete and confirmed. This includes:
    *   **Always reading relevant files** (using tools like `view_files` or shell commands) immediately before analysis.
    *   **Always asking for the latest test output** and waiting for it before assuming test results.
    *   **Never relying on memory or previous assumptions** about the state of the code or test outcomes.

### Code-Documentation Discrepancy Protocol

If I detect a conflict between the instructions in a guide (e.g., a `.md` plan file) and the actual state of the codebase (e.g., function signatures, file structures), I will immediately halt the implementation process. I will then:
1.  Clearly state the discrepancy, citing both the documentation and the conflicting code.
2.  Initiate a reasoning process with you to determine whether the documentation is outdated or the code is incorrect.
3.  Once we have identified the source of truth, I will propose a plan to resolve the conflict by either updating the documentation or correcting the code before proceeding.

### Enhanced TDD Baby Steps Rules for AI Assistant

To ensure strict adherence to baby steps and prevent deviations:
1. **Strict Baby Steps Only**: Every TDD cycle must be broken into individual steps (Red: one small failing test; Green: minimal code to pass; Refactor/Doc/Commit: cleanup and documentation). The AI assistant MUST NOT propose or bundle multiple steps (e.g., multiple tests or full implementations) in a single response unless explicitly requested by the user.
2. **Transparency and Confirmation**: Before suggesting any change to the agreed process (e.g., for efficiency or edge cases), the AI assistant MUST:
   - Explicitly state the proposed change.
   - Provide clear reasons (e.g., "This could reduce redundancy because...").
   - Pause and wait for user confirmation before proceeding.
3. **Fail-Fast Efficiency**: Prioritize small, incremental changes to allow quick test runs and early error detection. Avoid comprehensive proposals that could lead to debugging loops—efficiency comes from iteration, not volume.
4. **Mitigation Check**: At the start of each cycle, reference this section and confirm alignment with the user (e.g., "Confirming we're following baby steps as per GEMINI.md").

If a deviation occurs, revisit and update this section collaboratively.