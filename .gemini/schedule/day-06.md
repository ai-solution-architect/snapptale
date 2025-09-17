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

- [ ] **Red:** Create a test that attempts to import `StorybookPreview` and fails because the file doesn't exist.
- [ ] **Green:** Create the empty `src/components/StorybookPreview.tsx` file.
- [ ] **Doc:** Update `day-06.md` to mark this step as complete.
- [ ] **Commit:** `feat(storybook): create StorybookPreview component file`

### TDD Cycle 1.2: Render Chapter Titles and Text

- [ ] **Red:** Add a test to `tests/storybook-preview.test.tsx` that asserts the presence of chapter titles and text when `StorybookPreview` is rendered with mock data. This test should fail.
- [ ] **Green:** Implement the minimal JSX in `src/components/StorybookPreview.tsx` to render the chapter titles and text from the `story` prop.
- [ ] **Doc:** Update `day-06.md` to mark this step as complete.
- [ ] **Commit:** `feat(storybook): render chapter titles and text in StorybookPreview`

### TDD Cycle 1.3: Render Chapter Images

- [ ] **Red:** Add a test to `tests/storybook-preview.test.tsx` that asserts the presence of chapter images with correct `src` and `alt` attributes. This test should fail.
- [ ] **Green:** Implement the minimal JSX in `src/components/StorybookPreview.tsx` to render the chapter images from the `story` prop.
- [ ] **Doc:** Update `day-06.md` to mark this step as complete.
- [ ] **Commit:** `feat(storybook): render chapter images in StorybookPreview`

### TDD Cycle 1.4: Add Export PDF Button

- [ ] **Red:** Add a test to `tests/storybook-preview.test.tsx` that asserts the presence of an "Export PDF" button. This test should fail.
- [ ] **Green:** Implement the minimal JSX in `src/components/StorybookPreview.tsx` to render the "Export PDF" button.
- [ ] **Doc:** Update `day-06.md` to mark this step as complete.
- [ ] **Commit:** `feat(storybook): add Export PDF button to StorybookPreview`

### TDD Cycle 1.5: Integrate `StorybookPreview` into `UploadPage`

- [ ] **Red:** Modify `src/app/upload/page.tsx` to import `StorybookPreview` and replace the existing story rendering JSX with the new component. This will likely cause existing `upload.test.tsx` tests to fail if they directly assert on the story content within `UploadPage`.
- [ ] **Green:** Adjust `src/app/upload/page.tsx` to correctly pass the `story` prop to `StorybookPreview`. Update `upload.test.tsx` if necessary to assert on the presence of `StorybookPreview` or its content indirectly.
- [ ] **Doc:** Update `day-06.md` to mark this step as complete.
- [ ] **Commit:** `refactor(upload): integrate StorybookPreview into UploadPage`

### TDD Cycle 1.6: Pass `onExport` and `isExporting` Props

- [ ] **Red:** Modify `tests/storybook-preview.test.tsx` to assert that `onExport` is called when the button is clicked and that the button is disabled when `isExporting` is true. This test should fail.
- [ ] **Green:** Update `src/components/StorybookPreview.tsx` to accept and use `onExport` and `isExporting` props for the button.
- [ ] **Doc:** Update `day-06.md` to mark this step as complete.
- [ ] **Commit:** `feat(storybook): pass onExport and isExporting props to StorybookPreview`

***

## Step 2: Implement PDF Export Logic

### TDD Cycle 2.1: Install PDF Libraries

- [ ] **Red:** Attempt to import `jspdf` and `html2canvas` in a test file (e.g., a new `tests/pdf-export.test.ts`) and observe import errors because the packages are not installed.
- [ ] **Green:** Run `npm install jspdf html2canvas` and `npm install --save-dev @types/jspdf @types/html2canvas`.
- [ ] **Doc:** Update `day-06.md` to mark this step as complete.
- [ ] **Commit:** `chore(deps): install jspdf and html2canvas for PDF export`

### TDD Cycle 2.2: Implement `handleExportPdf` Function (Initial Structure)

- [ ] **Red:** Create a new test file (e.g., `tests/pdf-export.test.ts`) and write a test that attempts to call `handleExportPdf` (mocking `jspdf` and `html2canvas`) and asserts that `setIsExportingPdf` is called. This test should fail because `handleExportPdf` doesn't exist yet.
- [ ] **Green:** Add the basic structure of `handleExportPdf` to `src/app/upload/page.tsx`, including `setIsExportingPdf(true)` and `setIsExportingPdf(false)` in the `finally` block.
- [ ] **Doc:** Update `day-06.md` to mark this step as complete.
- [ ] **Commit:** `feat(pdf): add initial handleExportPdf function structure`

### TDD Cycle 2.3: Implement PDF Generation (Text and Basic Structure)

- [ ] **Red:** Enhance the `tests/pdf-export.test.ts` to mock `jspdf` and assert that `addPage`, `setFontSize`, and `text` methods are called with expected arguments for chapter titles and text.
- [ ] **Green:** Implement the `jspdf` logic in `handleExportPdf` to add pages, chapter titles, and text content from the story.
- [ ] **Doc:** Update `day-06.md` to mark this step as complete.
- [ ] **Commit:** `feat(pdf): generate basic pdf with chapter titles and text`

### TDD Cycle 2.4: Implement PDF Generation (Images)

- [ ] **Red:** Further enhance `tests/pdf-export.test.ts` to mock `html2canvas` and `addImage` from `jspdf`, asserting that images are correctly processed and added to the PDF.
- [ ] **Green:** Implement the `html2canvas` and `addImage` logic in `handleExportPdf` to include chapter images, handling aspect ratios and page breaks.
- [ ] **Doc:** Update `day-06.md` to mark this step as complete.
- [ ] **Commit:** `feat(pdf): add chapter images to pdf export`

### TDD Cycle 2.5: Implement PDF Saving

- [ ] **Red:** Add a test to `tests/pdf-export.test.ts` that asserts `pdf.save` is called with the correct filename.
- [ ] **Green:** Add `pdf.save` call to `handleExportPdf`.
- [ ] **Doc:** Update `day-06.md` to mark this step as complete.
- [ ] **Commit:** `feat(pdf): save generated pdf file`

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