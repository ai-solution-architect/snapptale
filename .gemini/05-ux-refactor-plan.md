# UX Refactor Plan: Aligning Snaptale with Brand Guidelines

This document outlines the plan to refactor the Snaptale application's look and feel to align with the provided brand guidelines, following a strict TDD workflow.

**Note:** We will be following the strict TDD workflow defined in `GEMINI.md`. Each cycle must be fully completed and checked off before the next begins. After each step (Red, Green, Refactor, Documentation, Commit), you must commit the changes and mark the step with an `[x]`.

## Phase 1: Color Palette Integration

### TDD Cycle 1: Define Custom Tailwind Colors

- [ ] **Red:** Write a failing test that asserts a non-existent Tailwind color class (e.g., `text-snaptale-primary`) is not applied to an element.
- [ ] **Green:** Implement the custom color definitions in `tailwind.config.js` to map brand hex codes to Tailwind's `theme.extend.colors`.
- [ ] **Refactor:** (If necessary) Ensure the color definitions are clean and follow Tailwind best practices.
- [ ] **Doc:** Update this plan with the results of the cycle.
- [ ] **Commit:** `feat(ux): define custom brand colors in Tailwind config`

### TDD Cycle 2: Update `globals.css` for Light Mode Background/Foreground

- [ ] **Red:** Write a failing test that checks if the `--background` and `--foreground` CSS variables in `globals.css` are set to the brand's light mode colors.
- [ ] **Green:** Update `src/app/globals.css` to set `--background` to `#F9FAFB` and `--foreground` to `#1D3557` for light mode.
- [ ] **Refactor:** (If necessary) Ensure CSS variables are correctly applied.
- [ ] **Doc:** Update this plan with the results of the cycle.
- [ ] **Commit:** `feat(ux): update global CSS variables for light mode brand colors`

### TDD Cycle 3: Apply Brand Colors to `UploadPage` Components

- [ ] **Red:** Write a failing integration test for `UploadPage` that asserts a specific element (e.g., a card background or text) does not have the correct brand color class (e.g., `bg-snaptale-background`, `text-snaptale-shadow`).
- [ ] **Green:** Modify `src/app/upload/page.tsx` to replace generic color classes (e.g., `bg-gray-100`, `bg-white`, `text-blue-600`) with the new custom brand color classes.

- [ ] **Refactor:** (If necessary) Ensure consistent application of brand colors across the component.
- [ ] **Doc:** Update this plan with the results of the cycle.
- [ ] **Commit:** `feat(ux): apply brand colors to UploadPage components`

## Phase 2: Typography Integration

### TDD Cycle 4: Configure Tailwind Fonts

- [ ] **Red:** Write a failing test that asserts a non-existent Tailwind font class (e.g., `font-poppins`) is not applied to an element.
- [ ] **Green:** Extend Tailwind's `fontFamily` in `tailwind.config.js` to include Poppins and Nunito.
- [ ] **Refactor:** (If necessary) Ensure font definitions are correct.
- [ ] **Doc:** Update this plan with the results of the cycle.
- [ ] **Commit:** `feat(ux): configure custom brand fonts in Tailwind config`

### TDD Cycle 5: Apply Brand Fonts to `globals.css`

- [ ] **Red:** Write a failing test that checks if `font-sans` and `font-mono` (or custom variables) in `globals.css` are set to use the new brand fonts.
- [ ] **Green:** Update `src/app/globals.css` to set `font-sans` and `font-mono` to use the new brand fonts.
- [ ] **Refactor:** (If necessary) Ensure font imports and applications are correct.
- [ ] **Doc:** Update this plan with the results of the cycle.
- [ ] **Commit:** `feat(ux): apply brand fonts to global CSS`

### TDD Cycle 6: Apply Brand Fonts to Components

- [ ] **Red:** Write a failing integration test for a component (e.g., `UploadPage`) that asserts a specific text element does not have the correct brand font class (e.g., `font-poppins`, `font-nunito`).
- [ ] **Green:** Apply the new font classes to headings, body text, and buttons in relevant components.
- [ ] **Refactor:** (If necessary) Ensure consistent application of brand fonts.
- [ ] **Doc:** Update this plan with the results of the cycle.
- [ ] **Commit:** `feat(ux): apply brand fonts to UI components`

## Phase 3: Logo and Imagery Integration

### TDD Cycle 7: Replace Text Logo with Image in `UploadPage`

- [ ] **Red:** Write a failing integration test for `UploadPage` that asserts the `Snaptale-Logo.png` image is not present and the text "Snaptale" is still visible as a logo.
- [ ] **Green:** Modify `src/app/upload/page.tsx` to replace the text "Snaptale" with an `<img>` tag referencing `Snaptale-Logo.png`.
- [ ] **Refactor:** (If necessary) Ensure proper image sizing and accessibility attributes.
- [ ] **Doc:** Update this plan with the results of the cycle.
- [ ] **Commit:** `feat(ux): replace text logo with image in UploadPage`

### TDD Cycle 8: Integrate Hero Image on Landing Page

- [ ] **Red:** Write a failing integration test for the landing page (`page.tsx`) that asserts `Snaptale-Hero.png` is not present.
- [ ] **Green:** Modify `src/app/page.tsx` to include `Snaptale-Hero.png` to establish a visual identity.
- [ ] **Refactor:** (If necessary) Ensure proper image sizing and layout.
- [ ] **Doc:** Update this plan with the results of the cycle.
- [ ] **Commit:** `feat(ux): integrate hero image on landing page`

### TDD Cycle 9: Update Favicon

- [ ] **Red:** Write a failing test (or manual verification step) that checks if the favicon is updated to use the brand's icon. (Note: Automated testing of favicon changes can be complex, manual verification might be more practical here).
- [ ] **Green:** Replace `src/app/favicon.ico` with the brand's favicon.
- [ ] **Refactor:** (If necessary) Ensure the favicon is correctly linked in `layout.tsx`.
- [ ] **Doc:** Update this plan with the results of the cycle.
- [ ] **Commit:** `feat(ux): update favicon to brand icon`

## Phase 4: Overall Look and Feel Refinements

### TDD Cycle 10: Refine Rounded Corners and Shadows

- [ ] **Red:** Write a failing integration test for a component that asserts elements do not have consistent rounded corners or subtle shadows as per brand guidelines.
- [ ] **Green:** Review and refine `tailwind.config.js` or component classes to ensure consistent application of rounded corners and subtle shadows.
- [ ] **Refactor:** (If necessary) Ensure consistency across components.
- [ ] **Doc:** Update this plan with the results of the cycle.
- [ ] **Commit:** `feat(ux): refine rounded corners and shadows for brand consistency`

### TDD Cycle 11: Review Spacing and Layout

- [ ] **Red:** Write a failing integration test for a component that asserts incorrect spacing or cluttered layout.
- [ ] **Green:** Adjust Tailwind spacing classes (e.g., `p-`, `m-`, `gap-`) in components to ensure an open and uncluttered feel.
- [ ] **Refactor:** (If necessary) Ensure consistent spacing across the application.
- [ ] **Doc:** Update this plan with the results of the cycle.
- [ ] **Commit:** `feat(ux): adjust spacing and layout for child-friendly design`

### TDD Cycle 12: Style Buttons with Brand Guidelines

- [ ] **Red:** Write a failing integration test for a button component that asserts it does not apply brand colors or specific styling (e.g., `font-bold`).
- [ ] **Green:** Apply brand colors and additional styling (e.g., `font-bold`, `hover` states) to buttons in relevant components.
- [ ] **Refactor:** (If necessary) Create a reusable button component if multiple buttons require the same styling.
- [ ] **Doc:** Update this plan with the results of the cycle.
- [ ] **Commit:** `feat(ux): style buttons according to brand guidelines`