# Project Structure

This document provides an overview of the Snapptale project's directory structure and file organization.

```
/snapptale/
├── .gemini/                    # AI-assisted development documentation and planning
│   ├── 00-project-structure.md          # Project structure documentation
│   ├── 00-promt-preparing-review-plan.md # Prompt preparation review plan for AI assistance
│   ├── 00-snapptale-implementation-plan.md # Main implementation roadmap and milestones
│   ├── 01-google-ai-integration.md      # Step-by-step guide for Google AI integration
│   ├── 01-ollama-integration.md         # Documentation for local Ollama AI setup
│   ├── 02-environment-configuration-implementation.md # Environment setup implementation guide
│   ├── 02-environment-configuration-plan.md # Planning document for environment configuration
│   ├── 02-image-userstory.md            # User story for image processing features
│   ├── 03-brand.md                      # Brand guidelines and visual identity
│   ├── 04-ux-refactor.md                # UX improvement documentation
│   ├── 05-ux-refactor-plan.md           # Detailed plan for UX refactoring
│   ├── 06-tdd-green-flow.md             # TDD workflow - successful implementation steps
│   ├── 06-tdd-red-flow.md               # TDD workflow - failing test scenarios
│   ├── coaching-guide-sync-prompt.md    # AI coaching prompt synchronization
│   ├── prepare-chat-prompt.md           # Chat prompt preparation for AI assistance
│   ├── review-plan.md                   # Code review planning and process
│   └── schedule/                        # Daily development schedule and milestones
│       ├── day1.md                      # Day 1 development plan and goals
│       ├── day2.md                      # Day 2 development plan and goals
│       ├── day3.md                      # Day 3 development plan and goals
│       ├── day4.md                      # Day 4 development plan and goals
│       ├── day5.md                      # Day 5 development plan and goals
│       └── day6.md                      # Day 6 development plan and goals
├── .git/                       # Git version control directory
├── .swc/                       # SWC compiler cache directory for faster builds
├── brand-assets/               # Brand assets and guidelines
│   ├── Snaptale-Brand-Kit_v4.pdf        # Complete brand kit with logos and guidelines
│   └── Assets/                          # Brand asset files
│       ├── README.txt                   # Brand assets usage instructions
│       ├── colors/                      # Color palette assets for consistent branding
│       │   ├── Snaptale-Background-Color.png  # Background color swatch
│       │   ├── Snaptale-Highlight-Color.png   # Highlight color swatch
│       │   ├── Snaptale-Primary-Color.png     # Primary brand color swatch
│       │   ├── Snaptale-Secondary-Color.png   # Secondary color swatch
│       │   └── Snaptale-Shadow-Color.png      # Shadow effect color swatch
│       ├── images/                      # Brand images and illustrations
│       │   ├── Snaptale-Ad-1.png        # Advertisement image 1
│       │   ├── Snaptale-Ad-2.png        # Advertisement image 2
│       │   ├── Snaptale-Hero.png        # Hero image for main pages
│       │   └── Snaptale-Illustration.png # Custom illustrations
│       └── typography_info.json         # Font and typography specifications
├── public/                     # Static assets served publicly
│   ├── Snaptale-Logo.png                # Main application logo
│   ├── file.svg                         # Generic file icon
│   ├── globe.svg                        # Globe/world icon
│   ├── next.svg                         # Next.js framework logo
│   ├── thumb-snaptale-youtube.png       # YouTube video thumbnail
│   ├── vercel.svg                       # Vercel deployment platform logo
│   └── window.svg                       # Window/application icon
├── scripts/                    # Utility scripts for development and maintenance
│   └── check-google-ai.mjs              # Script to verify Google AI SDK connectivity
├── src/                        # Main source code directory
│   ├── app/                             # Next.js App Router structure
│   │   ├── favicon.ico                  # Browser tab icon for the website
│   │   ├── globals.css                  # Global CSS styles applied site-wide
│   │   ├── layout.tsx                   # Root layout component wrapping all pages
│   │   ├── page.tsx                     # Home page component for the root route
│   │   ├── api/                         # API routes for backend functionality
│   │   │   └── upload/                  # File upload API endpoint
│   │   │       └── route.ts             # HTTP handler for file upload requests
│   │   └── upload/                      # Upload page route
│   │       └── page.tsx                 # Upload page component with image preview
│   ├── components/                      # Reusable UI components
│   │   └── StorybookPreview.tsx         # Component for previewing generated stories
│   ├── hooks/                           # Custom React hooks for reusable logic
│   │   ├── useFilePreview.ts            # Hook for managing image preview state
│   │   └── usePdfExporter.ts            # Hook for exporting stories as PDF documents
│   └── lib/                             # Library and utility functions
│       └── ai/                          # AI-related functionality
│           ├── image.ts                 # Image processing utilities for AI analysis
│           ├── index.ts                 # AI service abstraction layer and provider switching
│           └── prompts.ts               # AI prompt templates for story generation
├── tests/                      # Test files for quality assurance
│   ├── ai.test.ts                       # Tests for AI service integration
│   ├── api/                             # API route tests
│   │   ├── jest.config.mjs              # Jest configuration specific to API tests
│   │   └── upload.test.ts               # Tests for file upload API endpoint
│   ├── hooks/                           # Hook tests
│   │   └── usePdfExporter.test.ts       # Tests for PDF export functionality
│   ├── ui/                              # UI component tests
│   │   └── colors.test.tsx              # Tests for color utility functions
│   ├── home.test.tsx                    # Tests for home page component
│   ├── jest.setup.js                    # Jest setup configuration for test environment
│   ├── pdf-export.test.ts               # Additional tests for PDF export features
│   ├── setupTests.ts                    # Test setup utilities and mocks
│   ├── smoke.test.ts                    # Basic smoke tests for application health
│   ├── storybook-preview.test.tsx       # Tests for storybook preview component
│   └── upload.test.tsx                  # Tests for upload page component
├── .gitignore                  # Git ignore rules for excluding files from version control
├── docker-compose.override.yml.example  # Example Docker Compose override for customization
├── docker-compose.yml          # Docker Compose configuration for containerized development
├── eslint.config.mjs           # ESLint configuration for code quality and style rules
├── GEMINI.md                   # Gemini AI documentation and integration notes
├── jest.config.mjs             # Jest configuration for unit and integration testing
├── next.config.ts              # Next.js configuration for build and runtime settings
├── package-lock.json           # NPM lock file for exact dependency versions
├── package.json                # Project dependencies and scripts definition
├── postcss.config.mjs          # PostCSS configuration for CSS processing
├── README.md                   # Project README with setup and usage instructions
├── tailwind.config.js          # Tailwind CSS configuration for styling
└── tsconfig.json               # TypeScript configuration for compilation and type checking
```