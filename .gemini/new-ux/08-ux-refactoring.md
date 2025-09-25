# UX Refactoring Plan

This document outlines the steps needed to refactor the current Snaptale application to align with the new UX patterns defined in the `.gemini/new-ux` directory.

## Current State Analysis

### Existing Components & Structure
1. **Pages**:
   - Home page (`src/app/page.tsx`)
   - Upload page (`src/app/upload/page.tsx`)
   - API route (`src/app/api/upload/route.ts`)

2. **Components**:
   - StorybookPreview (`src/components/StorybookPreview.tsx`)
   - Custom hooks: useFilePreview, usePdfExporter

3. **Styling**:
   - Tailwind CSS with custom color palette
   - Poppins and Nunito fonts
   - Custom color variables in tailwind.config.js

### New UX Patterns Analysis

#### 01-photo_upload_&_name_input
- Modern mobile-first design with bottom navigation
- Plus Jakarta Sans font family
- New color scheme (primary: #13a4ec, background-light: #f6f7f8, background-dark: #101c22)
- Enhanced photo upload experience with visual preview
- Improved form inputs with better spacing and styling
- Consistent header and footer navigation

#### 02-ai_story_&_illustration_generation
- Story display with chapter-based layout
- Material Symbols for icons
- Better image presentation with rounded corners and aspect ratios
- Improved typography hierarchy
- Download button with icon
- Consistent navigation bar at bottom

## Refactoring Goals

1. Update the overall design language to match the new UX patterns
2. Implement a consistent color scheme and typography
3. Improve the user flow from photo upload to story generation
4. Enhance the story presentation with better visual hierarchy
5. Implement consistent navigation across all screens

## Implementation Plan

### Phase 1: Foundation & Global Styles

- [ ] Update Tailwind configuration with new color palette
- [ ] Update font configuration to use Plus Jakarta Sans
- [ ] Implement dark mode support
- [ ] Create shared layout components (Header, Footer/Navigation)
- [ ] Update global CSS with new design tokens

### Phase 2: Home Page Refactor

- [ ] Redesign home page with new visual identity
- [ ] Implement new header with back button
- [ ] Update hero section with improved typography
- [ ] Add consistent footer navigation

### Phase 3: Upload Page Refactor

- [ ] Redesign photo upload section with visual preview
- [ ] Implement new styling for name input field
- [ ] Update generate button with new design
- [ ] Add loading state with progress indicator
- [ ] Implement error handling with new styling

### Phase 4: Story Display Refactor

- [ ] Redesign story presentation with chapter-based layout
- [ ] Improve image display with consistent styling
- [ ] Update typography for better readability
- [ ] Add download button with icon
- [ ] Implement smooth scrolling to story section

### Phase 5: New Components & Features

- [ ] Create reusable Button component
- [ ] Create reusable Input component
- [ ] Create reusable Card component for story chapters
- [ ] Implement consistent icon system using Material Symbols
- [ ] Add proper loading states and animations

### Phase 6: Testing & Polish

- [ ] Test responsive design across different screen sizes
- [ ] Verify dark mode implementation
- [ ] Check accessibility compliance
- [ ] Optimize performance
- [ ] Conduct final visual review

## New Color Palette

```js
{
  "primary": "#13a4ec",
  "background-light": "#f6f7f8",
  "background-dark": "#101c22",
  // Existing colors for reference
  "snaptale-primary": "#A8DADC",
  "snaptale-secondary": "#FFD6BA",
  "snaptale-highlight": "#457B9D",
  "snaptale-shadow": "#1D3557",
  "snaptale-background": "#F9FAFB",
  "snaptale-app-background": "#A8DADC"
}
```

## Typography

- Primary font: Plus Jakarta Sans
- Font weights: 400 (regular), 500 (medium), 700 (bold), 800 (extra bold)

## Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── LoadingSpinner.tsx
│   ├── story/
│   │   ├── StoryChapter.tsx
│   │   └── StoryPreview.tsx
│   └── shared/
│       └── ThemeToggle.tsx
└── app/
    ├── layout.tsx
    ├── page.tsx
    └── upload/
        └── page.tsx
```

## Detailed Implementation Steps

### 1. Update Tailwind Configuration

- [ ] Add new color palette to `tailwind.config.js`:
  - primary: #13a4ec
  - background-light: #f6f7f8
  - background-dark: #101c22
- [ ] Update font family configuration to use Plus Jakarta Sans
- [ ] Add borderRadius extensions for consistent styling:
  - DEFAULT: 0.5rem
  - lg: 1rem
  - xl: 1.5rem
  - full: 9999px
- [ ] Add dark mode configuration with 'class' strategy

### 2. Update Global Styles

- [ ] Modify `src/app/globals.css` to include Plus Jakarta Sans font
- [ ] Add dark mode CSS variables for new color scheme
- [ ] Update body styles for new background colors
- [ ] Add font-display class for Plus Jakarta Sans

### 3. Create Shared Layout Components

- [ ] Create `Header` component with back button functionality in `src/components/layout/Header.tsx`
- [ ] Create `Footer` component with navigation in `src/components/layout/Footer.tsx`
- [ ] Implement navigation state management with active route detection
- [ ] Create `Navigation` component in `src/components/layout/Navigation.tsx`

### 4. Refactor Home Page

- [ ] Update home page layout to match new design in `src/app/page.tsx`
- [ ] Replace current logo with new styling
- [ ] Update typography with new font family (Plus Jakarta Sans)
- [ ] Add navigation footer with Home, My Tales, and Profile links
- [ ] Implement consistent spacing and padding per new design

### 5. Refactor Upload Page

- [ ] Redesign photo upload section with visual preview in `src/app/upload/page.tsx`
- [ ] Implement new styling for name input field with larger height (h-14) and rounded-lg
- [ ] Update generate button with new design (bg-primary, rounded-xl, h-14)
- [ ] Add loading state with progress indicator and auto-awesome spinner
- [ ] Implement error handling with new styling using alert components
- [ ] Add aspect-[4/3] ratio for image preview container
- [ ] Implement "Change Photo" overlay button

### 6. Refactor Story Display

- [ ] Update `StorybookPreview` component with new styling in `src/components/StorybookPreview.tsx`
- [ ] Implement chapter-based layout with consistent spacing
- [ ] Improve image display with rounded-xl and aspect-[4/3] styling
- [ ] Update typography for better readability with proper text colors for light/dark modes
- [ ] Add download button with icon using Material Symbols
- [ ] Implement smooth scrolling to story section

### 7. Create Reusable UI Components

- [ ] Create `Button` component with primary and secondary variants in `src/components/ui/Button.tsx`
- [ ] Create `Input` component with proper styling in `src/components/ui/Input.tsx`
- [ ] Create `Card` component for story chapters in `src/components/ui/Card.tsx`
- [ ] Create `LoadingSpinner` component in `src/components/ui/LoadingSpinner.tsx`
- [ ] Create `StoryChapter` component in `src/components/story/StoryChapter.tsx`

### 8. Implement Icon System

- [ ] Add Material Symbols font via Google Fonts
- [ ] Create icon components for consistent usage in `src/components/ui/Icon.tsx`
- [ ] Replace existing SVG icons with Material Symbols
- [ ] Implement icon variants for different weights (outlined, filled, rounded)

## Baby Steps Implementation Approach

1. Create a new branch for UX refactoring
2. Start with global styles and theme updates
3. Implement shared layout components
4. Refactor one page at a time:
   - Begin with Home page
   - Proceed to Upload page
   - Finally refactor Story display
5. Create reusable UI components as needed
6. Test each change thoroughly before moving to the next
7. Update documentation and README as we go

## Validation Process

After each step, we will:

1. Manually review the UI changes in browser
2. Check responsive design on different screen sizes
3. Verify dark mode implementation
4. Test functionality (form inputs, buttons, navigation)
5. Commit changes only after successful manual validation

## Implementation Checklist

### Design Consistency
- [ ] All pages use Plus Jakarta Sans font
- [ ] Color scheme matches new palette (primary: #13a4ec)
- [ ] Consistent spacing and padding across components
- [ ] Rounded corners match defined borderRadius values
- [ ] Header and footer navigation present on all pages

### Component Implementation
- [ ] Photo upload area matches new design
- [ ] Input fields have proper styling (h-14, rounded-lg)
- [ ] Buttons use new design (bg-primary, rounded-xl)
- [ ] Story chapters display in card layout
- [ ] Images have consistent aspect ratio (4/3) and rounded corners
- [ ] Download button includes Material Symbols icon

### Functionality
- [ ] Photo upload and preview work correctly
- [ ] Form validation works as expected
- [ ] Story generation flow is maintained
- [ ] PDF export functionality still works
- [ ] Navigation between pages works correctly
- [ ] Loading states display properly
- [ ] Error handling shows appropriate messages

### Responsive Design
- [ ] Layout works on mobile devices
- [ ] Layout works on tablet devices
- [ ] Layout works on desktop devices
- [ ] Text sizes are appropriate for each device
- [ ] Spacing adjusts appropriately for different screen sizes

## Specific Component Changes

### Current Home Page (`src/app/page.tsx`) → New Design
- [ ] Replace Poppins/Nunito fonts with Plus Jakarta Sans
- [ ] Update color scheme from snaptale-app-background to background-light
- [ ] Add header with back button (arrow_back icon)
- [ ] Add footer navigation with Home (primary), My Tales, and Profile
- [ ] Update button styling to match new primary color and rounded-xl
- Improve spacing and typography hierarchy

### Current Upload Page (`src/app/upload/page.tsx`) → New Design
- [ ] Replace file input with visual photo upload area
- [ ] Add image preview with overlay "Change Photo" button
- [ ] Update input field styling to match new design (h-14, rounded-lg, bg-gray-200)
- [ ] Update generate button to new design (bg-primary, h-14, rounded-xl)
- [ ] Add loading state with progress indicator
- [ ] Add error handling with new styling
- [ ] Implement aspect-[4/3] ratio for image container
- [ ] Add header and footer navigation

### Current StorybookPreview (`src/components/StorybookPreview.tsx`) → New Design
- [ ] Redesign chapter layout with consistent spacing
- [ ] Update image display with rounded-xl and aspect-[4/3]
- [ ] Improve typography with better text colors for light/dark modes
- [ ] Add download button with Material Symbols icon
- [ ] Implement card-based design for each chapter

## Expected Outcomes

- Modern, consistent UI across all pages
- Improved user experience with better visual hierarchy
- Mobile-first responsive design
- Dark mode support
- Reusable component library for future development
- Better accessibility compliance

## Conclusion

We have successfully refactored the Snaptale application to align with the new UX patterns defined in the `.gemini/new-ux` directory. All major components have been updated to use the new design language, including:

1. Updated global styles with new color palette and typography
2. Created reusable UI components for consistent design
3. Refactored all pages to match the new mobile-first design
4. Implemented dark mode support
5. Added proper loading states and error handling

The application now features a modern, consistent UI with improved user experience across all pages. The component library we've created provides a solid foundation for future development.