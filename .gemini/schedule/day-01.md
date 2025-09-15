# Snapptale — Day 1 Development Guide  
### Kickoff, Setup & Initial UI Scaffold with Next.js App Router + TDD + Modern Jest Setup  
*Goal: Complete core setup, write first tests, and run passing with Next.js supported Jest in ~2 hours*

***

##  Day 1: Kickoff & Setup — Next.js App Router + Tailwind + TypeScript + ESLint + Jest (Modern & Tested)

### Goal for Today  
By the end, you will have:

- Installed and configured Node.js, Git, and Qoder IDE (with Google Gemini CLI AI assist)  
- Scaffolded a new Next.js project using the App Router (`src/app` folder) with TypeScript, ESLint, and Tailwind CSS  
- Installed and configured **Jest with Next.js-friendly support and ES Modules-compatible config**  
- Written simple Jest & React Testing Library tests for Homepage and Upload page  
- Implemented minimal working components so those tests pass (basic TDD flow)  
- Run and debugged tests successfully—avoiding common pitfalls  
- Committed clean, test-verified code to Git  
- Drafted a clear roadmap emphasizing testing & future AI integration  

***

## 1. What You’re Building Today  
- A React + Next.js App Router web app named **Snapptale**  
- Homepage (in `src/app/page.tsx`) with a link to Upload page  
- Upload page (in `src/app/upload/page.tsx`) with disabled file input  
- Tests verifying page content and UI elements  
> *No AI integration today — focus on solid structure, routing, and reliable testing setup.*

***

## 2. Tools You’ll Need  

| Tool                      | Purpose                                 | How/Where to Get                           |
|---------------------------|-----------------------------------------|--------------------------------------------|
| Node.js (v18+)            | Runtime & Next.js support                | https://nodejs.org                         |
| Git                       | Version control                         | https://git-scm.com                        |
| Qoder IDE                 | Development + AI coding assistant        | Provided by your organization or official  |
| GitHub                    | Remote repository                      | https://github.com                         |
| Next.js + React           | App framework with modern routing       | Bootstrapped via CLI                       |
| TypeScript                | Adds typing to JavaScript                | Included in scaffold                       |
| ESLint                    | Code linting for better quality        | Included in scaffold                       |
| Tailwind CSS              | Utility CSS for styling                  | Included in scaffold                       |
| Jest + React Testing Library | Testing JavaScript & React components | Installed as dev dependencies              |
| @types/jest, @testing-library/jest-dom types | TypeScript support for Jest matchers | Installed as dev dependencies              |
| Google Gemini CLI + Qoder AI | Coding assistant inside Qoder IDE     | Enable in Qoder IDE                        |
| Figma (optional)          | UI design & prototyping                 | https://figma.com                          |

***

## 3. Step-by-Step Guide

***

### 0 — Prepare Your Environment (20 min)

- Install **Node.js (v18+)** and **Git** if not installed. Verify:  
```bash
node -v
git --version
```
- Open **Qoder IDE**; ensure **Google Gemini CLI and Qoder AI assistant** are enabled for coding help.

***

### 1 — Create Project & Initialize Git (10 min)  

- Open a terminal inside Qoder or system terminal:  
```bash
mkdir snapptale
cd snapptale
git init
```
- Optionally create and link GitHub repo later.

***

### 2 — Bootstrap Next.js App with Tailwind + TypeScript + ESLint (25 min)  

- Run scaffold:  
```bash
npx create-next-app @latest . --typescript --eslint --tailwind
```
- Accept:  
  - TypeScript: **Yes**  
  - ESLint: **Yes**  
  - Tailwind CSS: **Yes**  
  - Experimental features: **No**

- Wait for install to finish.

***

### 3 — Install Testing Libraries & Types (20 min)  

- Install these dev dependencies:  
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest @types/testing-library__jest-dom jest-environment-jsdom
```
- The ` @types/jest` and ` @types/testing-library__jest-dom` packages *add TypeScript typings* so IntelliSense and TS compiler know about Jest globals and custom matchers like `.toBeInTheDocument()`.

***

### 4 — Configure Jest with Next.js Support (15 min)

- Create ES Module Jest config file named `jest.config.mjs` at your project root (`/snapptale`):  
```js
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: [' @testing-library/jest-dom'],
  testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};

export default createJestConfig(customJestConfig);
```
- This uses Next.js’s official Jest preset adapter so you can test with JSX and Next.js’s build system.

***

### 5 — Update `package.json` Test Script (5 min)  

- Replace or ensure your `package.json` inside `scripts` has:  
```json
"scripts": {
  "test": "jest"
}
```
- Now Jest will run with above config properly.

***

### 6 — Create Homepage: `src/app/page.tsx` (20 min)

- Edit the file at `src/app/page.tsx` with:  
```tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-5xl font-extrabold text-blue-600 mb-6">Snapptale</h1>
      <p className="mb-8 text-lg">
        Upload a photo to start your personalized storybook journey.
      </p>
      <Link href="/upload" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded focus:ring-2 focus:ring-blue-500">
        Go to Upload
      </Link>
    </main>
  );
}
```
- Save your changes.

***

### 7 — Create Upload Page: `src/app/upload/page.tsx` (20 min)  

- Create folder `/src/app/upload` if missing.  
- Create file `/src/app/upload/page.tsx` with:  
```tsx
export default function Upload() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6">Upload Photo</h1>
      <input type="file" accept="image/*" className="border border-gray-400 p-2 rounded mb-6" disabled />
      <button disabled className="bg-gray-400 cursor-not-allowed text-white px-6 py-3 rounded">Next (coming soon)</button>
    </main>
  );
}
```

***

### 8 — Create Tests Folder & Tests (20 min)  

- Create a top-level folder `/tests` in your project root `/snapptale`.  
- Create `tests/home.test.tsx` with:  
```tsx
import { render, screen } from ' @testing-library/react';
import Home from '../src/app/page';

describe('Home Page', () => {
  it('renders Snapptale title and navigation link', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /snapptale/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to upload/i })).toBeInTheDocument();
  });
});
```
- Create `tests/upload.test.tsx` with:  
```tsx
import { render, screen } from ' @testing-library/react';
import Upload from '../src/app/upload/page';

describe('Upload Page', () => {
  it('renders upload heading and disabled controls', () => {
    render(<Upload />);
    expect(screen.getByRole('heading', { name: /upload photo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });
});
```

***

### 9 — Run Tests and Fix if Needed (10 min)  

- Run tests:  
```bash
npm test
```
- Fix any issues (usually code or typo issues in components) until tests pass.

***

### 10 — Run Dev Server & Verify Manually (5 min)

- Start app:  
```bash
npm run dev
```
- Browse to: http://localhost:3000 (home page)  
- Click the ***Go to Upload*** button and confirm it routes to `/upload` page

***

### 11 — Commit Progress (5 min)

```bash
git add .
git commit -m "Day 1: Scaffold Snapptale Next.js App Router + Tailwind + Typescript + ESLint + Jest (ESM config) with Home and Upload pages + tests"
```

***

### 12 — Write Development Roadmap (5 min)

Update `README.md` at project root with:

```markdown
# Snapptale Development Roadmap (TDD + Modern Jest)

## Day 1 (Completed)
- Next.js App Router scaffold with Tailwind, TypeScript & ESLint
- Jest with official Next.js preset, ES Module config
- Created Home & Upload pages with tests passing

## Day 2
- Implement file upload & image preview with tests
- Setup backend API to accept files

## Day 3
- Integrate NanoBanana API for AI image generation
- Add story text AI integration

## Days 4-7
- Build story preview, export features, polish, deploy
```

***

## Coach's Final Notes

- **Always install ` @types/jest` and ` @types/testing-library__jest-dom`** with your testing libraries in TypeScript projects—this fixes the “describe/it/expect” unknown and matcher issues.  
- **Switch from classic Jest config to `jest.config.mjs` using Next.js’s `next/jest` preset** to fix JSX syntax and module resolution errors.  
- Remember to install `jest-environment-jsdom` explicitly to avoid missing environment errors in Jest 28+.  
- Your test files **cannot be empty**—make sure you write at least one test per file to avoid “test suite must contain at least one test” errors.  
- Run `npm test` frequently to verify correctness.  
- Use your **Google Gemini AI inside Qoder** as your coding assistant for snippets and error explanations.  
- Commit often with clear, descriptive messages to keep track of progress.

***

**You have now a rock-solid, beginner-friendly setup — with TDD and modern Jest config — fully compatible with your Next.js App Router app!**  
Ready for Day 2? Just say:  
*“Guide me through Day 2: Implement file upload & image preview for Snapptale (with tests)”*