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
- **Test-Driven Approach:** For every new feature, I will propose a unit test before writing the implementation.
- **Continuous Testing:** After any code update, I will remind you to run the test suite to ensure nothing has broken.
- **Source of Truth:** Our documentation (`GEMINI.md` and `.gemini/` files) and our tests are the primary source of truth. All code changes must be reflected in and validated by them.
- **Test Naming Convention:** Test names must be user-centric and business-faced, clearly describing the user story or business requirement being tested.
- **Test Assertion Integrity:** Never remove a test or assertion unless the corresponding feature has been explicitly removed and the test is no longer relevant. Tests should always align with the functionality they are designed to verify.

## 6. Documentation Notes

- The files in the `.gemini/schedule/` directory are historical guides and should be used for context, not re-run.

## 7. AI Interaction Guidelines

- **File Content Verification:** If there are persistent issues reading a file's content, or if the provided content seems incorrect, I will explicitly ask the user to verify the file's content or provide it directly.
- **Code Update Verification:** After any significant code update, especially those involving multiple changes or complex logic, I will explicitly ask the user to review the changes before proceeding to the next step.
- **Diff Output Clarification:** When discussing `diff` outputs, I will clearly specify whether the `diff` refers to an actual code file or a documentation file, and what the implications of the changes are.
- **Error Handling:** If I encounter an unexpected error or behavior from a tool, I will report it clearly and seek user guidance before attempting further actions.
- **Direct File Content Verification:** Before discussing or acting on the content of a specific file, I will always use a tool (like `read_file` or `run_shell_command` with `cat`) to directly read its current content. I will not rely on memory or previous assumptions about file content.
- **Mandatory Pre-Action Review:** Before performing any significant action, providing detailed reasoning, or answering a complex question, I will explicitly state that I am reviewing `GEMINI.md` and briefly summarize the relevant guidelines that apply to the current context. This is a mandatory self-check to ensure adherence to established conventions and guidelines.
- **Documentation Synchronization:** After any significant code change that alters or enhances a feature described in a `.gemini/*.md` file, I will propose an update to that specific documentation file to ensure it remains synchronized with the codebase.
- **Strict Codebase State Verification:** Before discussing, analyzing, or proposing any changes related to the codebase (including tests, components, or configurations), I will perform a mandatory, explicit verification of the relevant file contents and, if applicable, the latest test results. I will not proceed with any reasoning or action until this verification is complete and confirmed. This includes:
    *   **Always reading relevant files** (using `read_file` or `run_shell_command` with `cat`) immediately before analysis.
    *   **Always asking for the latest test output** and waiting for it before assuming test results.
    *   **Never relying on memory or previous assumptions** about the state of the code or test outcomes.