# Snapptale — Day 6: Implement PDF Export and Refine Storybook Display

### Goal
Implement the functionality to export the generated multi-chapter story as a PDF, and refine the storybook display by extracting it into a dedicated component.

***

## Overview

- Extract the multi-chapter story display into a new `StorybookPreview` component.
- Implement PDF generation and export/download functionality for the storybook.
- Use Test-Driven Development (TDD): start by writing tests that describe the expected user interactions and UI.
- Ensure clear feedback on loading and failure states during PDF generation.
- Maintain modular, clean architecture for the export logic suitable for future extensions.
- Keep UI styling consistent with previously implemented components and Tailwind CSS.

***

## Step 1: Extract Storybook Display into `StorybookPreview` Component (Refactoring with TDD)

The multi-chapter story display is currently embedded in `src/app/upload/page.tsx`. For better modularity and reusability, we will extract this logic into a new `StorybookPreview` component.

### TDD Cycle 1.1: Create `StorybookPreview` Component File

- [x] **Red:** Create a test that attempts to import `StorybookPreview` and fails because the file doesn't exist.
- [x] **Green:** Create the empty `src/components/StorybookPreview.tsx` file.
- [x] **Doc:** Update `day-06.md` to mark this step as complete.
- [x] **Commit:** `feat(storybook): create StorybookPreview component file`

### TDD Cycle 1.2: Render Chapter Titles and Text

- [x] **Red:** Add a test to `tests/storybook-preview.test.tsx` that asserts the presence of chapter titles and text when `StorybookPreview` is rendered with mock data. This test should fail.
- [x] **Green:** Implement the minimal JSX in `src/components/StorybookPreview.tsx` to render the chapter titles and text from the `story` prop.

- [x] **Doc:** Update `day-06.md` to mark this step as complete.
- [x] **Commit:** `feat(storybook): render chapter titles and text in StorybookPreview`

### TDD Cycle 1.3: Render Chapter Images

- [x] **Red:** Add a test to `tests/storybook-preview.test.tsx` that asserts the presence of chapter images with correct `src` and `alt` attributes. This test should fail.
- [x] **Green:** Implement the minimal JSX in `src/components/StorybookPreview.tsx` to render the chapter images from the `story` prop.
- [x] **Doc:** Update `day-06.md` to mark this step as complete.
- [x] **Commit:** `feat(storybook): render chapter images in StorybookPreview`

### TDD Cycle 1.4: Add Export PDF Button

- [x] **Red:** Add a test to `tests/storybook-preview.test.tsx` that asserts the presence of an "Export PDF" button. This test should fail.
- [x] **Green:** Implement the minimal JSX in `src/components/StorybookPreview.tsx` to render the "Export PDF" button.
- [x] **Doc:** Update `day-06.md` to mark this step as complete.
- [x] **Commit:** `feat(storybook): add Export PDF button to StorybookPreview`

### TDD Cycle 1.5: Integrate `StorybookPreview` into `UploadPage`

- [x] **Red:** Modify `src/app/upload/page.tsx` to import `StorybookPreview` and replace the existing story rendering JSX with the new component. This will likely cause existing `upload.test.tsx` tests to fail if they directly assert on the story content within `UploadPage`.
- [x] **Green:** Adjust `src/app/upload/page.tsx` to correctly pass the `story` prop to `StorybookPreview`. Update `upload.test.tsx` if necessary to assert on the presence of `StorybookPreview` or its content indirectly.
- [x] **Doc:** Update `day-06.md` to mark this step as complete.
- [x] **Commit:** `refactor(upload): integrate StorybookPreview into UploadPage`

### TDD Cycle 1.6: Pass `onExport` and `isExporting` Props

- [x] **Red:** Modify `tests/storybook-preview.test.tsx` to assert that `onExport` is called when the button is clicked and that the button is disabled when `isExporting` is true. This test should fail.
- [x] **Green:** Update `src/components/StorybookPreview.tsx` to accept and use `onExport` and `isExporting` props for the button.
- [x] **Doc:** Update `day-06.md` to mark this step as complete.
- [x] **Commit:** `feat(storybook): pass onExport and isExporting props to StorybookPreview`

***

## Step 2: Implement PDF Export Logic via `usePdfExporter` Hook

We will encapsulate all logic and state related to PDF exporting into a reusable custom hook. This improves testability and separation of concerns.

### TDD Cycle 2.1: Create Hook and Test Files

- [x] **Red:** Create a new test file `tests/hooks/usePdfExporter.test.ts` that attempts to import `usePdfExporter` from `@/hooks/usePdfExporter` and fails because the file doesn't exist.
- [x] **Green:** Create the empty `src/hooks/usePdfExporter.ts` file and export a basic `usePdfExporter` function.
- [x] **Doc:** Update `day-06.md` to mark this step as complete.
- [x] **Commit:** `feat(pdf): create usePdfExporter hook and test files`

### TDD Cycle 2.2: Test Initial State

- [x] **Red:** Write a test that calls the hook and asserts that it returns the correct initial state: `isExporting` is `false`, `error` is `null`, and `exportPdf` is a function.
- [x] **Green:** Implement the minimal state logic in the hook using `useState` to return the correct initial values.
- [x] **Doc:** Update `day-06.md` to mark this step as complete.
- [x] **Commit:** `feat(pdf): implement initial state for usePdfExporter`

### TDD Cycle 2.3: Test `isExporting` State Change

- [x] **Red:** Write a test that calls the `exportPdf` function and asserts that `isExporting` becomes `true` immediately, and then `false` after the operation completes.
- [x] **Green:** Wrap the logic inside `exportPdf` with `setIsExporting(true)` and a `finally` block containing `setIsExporting(false)`.
- [x] **Doc:** Update `day-06.md` to mark this step as complete.
- [x] **Commit:** `feat(pdf): manage isExporting state in usePdfExporter`

### TDD Cycle 2.4: Implement PDF Generation (Text)

- [x] **Red:** Mock `jspdf` and write a test to assert that when `exportPdf` is called, the `jspdf` constructor and the `text` method are invoked with the correct story content.
- [x] **Green:** Add the core `jspdf` logic to the `exportPdf` function to handle text content.
- [x] **Doc:** Update `day-06.md` to mark this step as complete.
- [x] **Commit:** `feat(pdf): generate pdf with text content`

### TDD Cycle 2.5: Implement PDF Generation (Images & Saving)

- [x] **Red:** Mock `html2canvas` and enhance the test to assert that `html2canvas` and `addImage` are called for each chapter, and that `save` is called at the end.
- [x] **Green:** Implement the `html2canvas` logic to handle images and add the `pdf.save()` call.
- [x] **Doc:** Update `day-06.md` to mark this step as complete.
- [x] **Commit:** `feat(pdf): add images and save functionality to pdf export`

### Verification: Run Tests and Verify Manually

Run `npm test`. All tests should pass.
Start the dev server (`npm run dev`), generate a story, and verify that the "Export PDF" button works and downloads a PDF with the story content and images.

***

## Step 3: Enhance Error Handling and Loading States

### TDD Cycle 3.1: Test Error Display

- [ ] **Red:** Add a test to `tests/upload.test.tsx` that mocks `handleExportPdf` to throw an error and asserts that the error message is displayed in the UI.
- [ ] **Green:** Implement the error display logic in `src/app/upload/page.tsx` to show the `error` state prominently.
- [ ] **Doc:** Update `day-06.md` to mark this step as complete.
- [ ] **Commit:** `feat(upload): display pdf export error messages`

***

## Step 4: Commit & Document

- [ ] **Commit:** Commit with a clear message: `"feat: Implement PDF export and refactor story display into StorybookPreview component"`
- [ ] **Doc:** Update `README.md` or other relevant documentation to mention the new PDF export feature.
- [ ] **Verify:** Ensure all tests pass (`npm test`).

***

# Summary

| Task                                     | Estimated Time | Notes                                                              |
|------------------------------------------|----------------|--------------------------------------------------------------------|
| Write `StorybookPreview` tests           | 20 min         | Drives component interface and behavior                            |
| Implement `StorybookPreview` component   | 30 min         | Extract existing UI, add export button, style with Tailwind        |
| Update `UploadPage` to use `StorybookPreview` | 15 min         | Integrate new component, pass props                                |
| Install PDF libraries                    | 5 min          | `jspdf`, `html2canvas` and their types                             |
| Write PDF export interaction tests       | 15 min         | Test `onExport` callback and `isExporting` state                   |
| Implement `handleExportPdf` function     | 45 min         | Core PDF generation logic, handle images, multi-page               |
| Enhance error/loading UI for export      | 10 min         | Ensure user feedback during PDF generation                         |