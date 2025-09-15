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

- **Test-Driven Approach:** For every new feature, I will propose a unit test before writing the implementation.
- **Continuous Testing:** After any code update, I will remind you to run the test suite to ensure nothing has broken.
- **Source of Truth:** Our documentation (`GEMINI.md` and `.gemini/` files) and our tests are the primary source of truth. All code changes must be reflected in and validated by them.