Based on the `00_sapmtale_implementation_plan.md` document you shared, here is the detailed guide for **Day 5** following your project's roadmap and best practices:

***

# Snapale — Day 5 Guide  
### Generate Multi-Chapter Story and Fetch Illustrations (TDD with Modularity & Decoupling)

***

## Day 5 Objective Summary  
- Implement the generation of a multi-chapter story (3 chapters as per MVP scope) with one illustration per chapter.  
- Fetch or generate illustrations for each chapter either by calling the AI image generation API or using mocks initially.  
- Build UI to display full story preview with text and images chapter by chapter.  
- Use TDD: write tests describing the expected UI and data flow before implementation.  
- Keep concerns separated: use a service layer for AI calls and UI/interaction purely focused on display & user flow.  
- Implement error handling and loading UI for each chapter.

***

## Step 1: Write Test for Multi-Chapter Story Display (TDD Step)

Add to `tests/upload.test.ts` or a new suite `tests/story.test.ts`:

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import StoryPreview from '@/components/StoryPreview'; // Assume you will create this

const mockStory = [
  { chapter: 1, text: 'The first kind words', imageUrl: '/mock1.png' },
  { chapter: 2, text: 'A new wonderful land', imageUrl: '/mock2.png' },
  { chapter: 3, text: 'The happily ever after', imageUrl: '/mock3.png' }
];

test('shows 3 story chapters with images', () => {
  render(<StoryPreview chapters={mockStory} />);
  mockStory.forEach(chapter => {
    expect(screen.getByText(new RegExp(chapter.text, 'i'))).toBeInTheDocument();
    expect(screen.getByAltText(new RegExp(`chapter ${chapter.chapter}`, 'i'))).toHaveAttribute('src', chapter.imageUrl);
  });
});
```

_The test captures the UI outcome: presence of chapter texts and images._

***

## Step 2: Implement Minimal StoryPreview Component (Pass Test)

Create a new file: `src/components/StoryPreview.tsx`

```tsx
import React from 'react';

export interface StoryChapter {
  chapter: number;
  text: string;
  imageUrl: string;
}

interface Props {
  chapters: StoryChapter[];
}

export default function StoryPreview({ chapters }: Props) {
  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      {chapters.map(ch => (
        <section key={ch.chapter} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Chapter {ch.chapter}</h3>
          <p className="mb-2">{ch.text}</p>
          <img src={ch.imageUrl} alt={`Chapter ${ch.chapter} Illustration`} className="rounded w-full" />
        </section>
      ))}
    </div>
  );
}
```

- This minimalist component renders the chapters as intended.  
- Run the test to verify it passes (green).

***

## Step 3: Integrate StoryPreview Into UploadPage

Update `src/app/upload/page.tsx` to import and display the story:

```tsx
import StoryPreview, { StoryChapter } from '@/components/StoryPreview';

// In your component state:
const [story, setStory] = React.useState<StoryChapter[] | null>(null);

// After generating the story:
setStory(result.story);

// In JSX render:
{story && <StoryPreview chapters={story} />}
```

***

## Step 4: Update Service Layer For Multi-Chapter Fetching

In `src/services/storyService.ts` (or existing service file), update the interface to return a multi-chapter story object (if not done yet):

```ts
export interface StoryChapter {
  chapter: number;
  text: string;
  imageUrl: string;
}

export interface GenerateStoryResult {
  story: StoryChapter[];
}

// Existing generateStorybook function upgrade:
export async function generateStorybook(args: { file: File; name: string }): Promise<GenerateStoryResult> {
  // call /api/story endpoint, parse and return chapters array
}
```

***

## Step 5: Backend API Adjustments (Optional Now or Deferred)

- Your existing `/api/story` or similar will emit the multi-chapter story with chapter text + image URL.  
- If not ready, keep returning mock multi-chapter data in the backend API or the API layer.

***

## Step 6: Test Plan & Error Handling

- Extend tests to include failure scenarios (e.g., partial generation failure, invalid image returned).  
- Implement in UI:
  - Loading spinner during story generation.  
  - Error messages if story generation fails.  
  - Ability to retry or reset.

***

## Summary of Day 5

| Activity                             | Time Estimate | Notes                                                     |
| ---------------------------------- | ------------- | --------------------------------------------------------- |
| Write test for multi-chapter UI    | 10-15m        | Start small, must fail first                              |
| Implement basic StoryPreview UI    | 20m           | Pass test, minimal code, rendered structure               |
| Integrate StoryPreview in page     | 10m           | Connect data flow, display story                          |
| Service layer type/interface update| 10m           | Modeling multi-chapter response, parsing                  |
| Backend mock or update API endpoint| 10-20m        | Serve fake or real multi-chapter story data                |
| Enhance error/loading UI states    | 15m           | Display spinner, errors with user feedback                 |

***

If you want, I can provide *fully worked out code snippets* for each step, to copy-paste, with detailed inline comments.

Also, I can coach you live via the stepwise TDD approach—for example, write a failing test for chapter display then help with the minimal code needed to pass it.

Would you like me to prepare the full code for Day 5 or start with just the first baby step (test) and help you through it incrementally?