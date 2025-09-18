# UX Refactor Analysis: Aligning Snaptale with Brand Guidelines

This document outlines the proposed design updates to align the Snaptale application's look and feel with the provided brand guidelines.

## 1. Color Palette Integration

*   **Current:** Uses generic white/black/gray and Tailwind's `blue-600`.
*   **Brand:**
    *   Primary: `#A8DADC` (Light Blue/Teal)
    *   Secondary: `#FFD6BA` (Light Orange/Peach)
    *   Highlight: `#457B9D` (Medium Blue)
    *   Shadow / Text: `#1D3557` (Dark Blue/Navy)
    *   Background: `#F9FAFB` (Very Light Gray/Off-White)
*   **Proposed Update:**
    *   **Define Custom Tailwind Colors:** Map the brand hex codes to Tailwind's `theme.extend.colors` in `tailwind.config.js`. This allows using classes like `text-snaptale-primary`, `bg-snaptale-background`, etc.
    *   **Update `globals.css`:**
        *   Light mode: Set `--background` to `#F9FAFB` (Brand Background) and `--foreground` to `#1D3557` (Brand Shadow/Text).
        *   Dark mode: Keep `--background` as `#0a0a0a` (or a very dark version of the brand's dark blue) and `--foreground` as `#A8DADC` (Brand Primary, or a very light version of it for contrast). We need to ensure the dark mode foreground contrasts well with `#0a0a0a` and aligns with the brand.
    *   **Apply to Components:** Update `bg-gray-100`, `bg-white`, `text-blue-600` classes in `UploadPage` and other components to use the new custom brand colors.

## 2. Typography Integration

*   **Current:** Generic `Arial, Helvetica, sans-serif`.
*   **Brand:** Primary: Poppins Bold, Secondary: Nunito Regular.
*   **Proposed Update:**
    *   **Import Fonts:** Use `@fontsource` or Google Fonts to import Poppins and Nunito.
    *   **Configure Tailwind Fonts:** Extend Tailwind's `fontFamily` in `tailwind.config.js` to use these fonts (e.g., `font-poppins`, `font-nunito`).
    *   **Apply to `globals.css`:** Set `font-sans` and `font-mono` (or custom variables) to use these new fonts.
    *   **Apply to Components:** Use the new font classes for headings, body text, and buttons.

## 3. Logo and Imagery Integration

*   **Current:** No official logo used.
*   **Brand:** `snaptale-draft-logo.png`, `Snaptale-Logo.png`, `Snaptale-Hero.png`, etc.
*   **Proposed Update:**
    *   **Replace Text Logo:** Replace the `Snaptale` heading in `UploadPage` with the `Snaptale-Logo.png` image.
    *   **Landing Page:** Use `Snaptale-Hero.png` on the landing page (`page.tsx`) to create a strong visual identity.
    *   **Favicon:** Ensure the favicon is updated to use the brand's icon.

## 4. Overall Look and Feel

*   **Current:** Functional, but generic.
*   **Brand:** Whimsical, child-friendly, clean, inviting.
*   **Proposed Update:**
    *   **Rounded Corners/Shadows:** The brand kit implies a soft, friendly aesthetic. Ensure consistent use of rounded corners and subtle shadows (already present in `UploadPage` but can be refined).
    *   **Spacing and Layout:** Review current spacing and padding to ensure it feels open and uncluttered, aligning with a child-friendly design.
    *   **Button Styling:** Apply brand colors and potentially more custom styling to buttons beyond just `font-bold`.
