Thank you for emphasizing the importance of “baby steps” and **never leaping ahead of the next test**—this is the heart of TDD coaching. Here is a revised Day 4 guide where **each test is introduced one at a time, and ONLY after you pass it do you proceed to the next test/feature step**. All code you add is ONLY what’s required for the current test. Every new UI element or handler is both specified and then implemented, so you always know why something is showing up—and avoid “missing label” errors.

***

# Snapptale — Day 4 Genuine TDD Baby Step Guide

***

## 💡 TDD Flow Principles

- Start with a **single new test** (RED).
- Implement exactly enough UI/code to make that test pass (GREEN).
- Once passing, write the next single desired behavior as a new test, and repeat.
- All user-interaction paths start FIRST with test and accessibility; all new UI is driven by the test.

***

## 1. 🚩 **First Baby Step: Add Name Input, “Next” Triggers Nothing** (Red → Green)

### 1a. **Write the Test**

**File:** `/tests/upload.test.tsx`  
Add this test before any dependency on file upload, story, or async work.

```tsx
// BEGIN Day 4 Step 1a: Minimum test for showing a name input and a Next button

it('shows a name input and the Next button (disabled unless name and file are filled)', () => {
  render(<UploadPage />);
  const nameInput = screen.getByLabelText(/child.*name/i);
  expect(nameInput).toBeInTheDocument();

  const fileInput = screen.getByLabelText(/choose file/i) || screen.getByTestId('file-input');
  const button = screen.getByRole('button', { name: /next/i });

  expect(fileInput).toBeInTheDocument();
  expect(button).toBeDisabled();

  // Simulate entry
  fireEvent.change(nameInput, { target: { value: 'Alex' } });
  expect(button).toBeDisabled(); // still needs file selection
});
// END Day 4 Step 1a
```

### 1b. **Implement UI Just for This Test**

**File:** `/src/app/upload/page.tsx`  
Add the label and input for name, then verify tests pass:

```tsx
// BEGIN Step 1b UploadPage: Input and button for TDD step 1
'use client';

import React, { useState } from 'react';
import { useFilePreview } from '@/hooks/useFilePreview';

export default function UploadPage() {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  return (
    <main>
      <label htmlFor="name-input">Child's Name</label>
      <input
        id="name-input"
        aria-label="Child's Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <label htmlFor="file-input">Choose file</label>
      <input
        id="file-input"
        type="file"
        aria-label="Choose file"
        onChange={onFileChange}
      />
      <button
        disabled={!name.trim() || !file}
      >
        Next
      </button>
    </main>
  );
}
// END Step 1b
```

Run tests—they should now pass.

***

## 2. 🚩 **Second Baby Step: Show “Generating story...” on Next Click** (Red → Green)

### 2a. **Write the Test**

```tsx
// BEGIN Day 4 Step 2a: Test that clicking Next shows loading feedback

it('shows a loading message after clicking Next, before results appear', () => {
  render(<UploadPage />);
  const nameInput = screen.getByLabelText(/child.*name/i);
  const fileInput = screen.getByLabelText(/choose file/i);
  const button = screen.getByRole('button', { name: /next/i });

  fireEvent.change(nameInput, { target: { value: 'Bobby' } });
  fireEvent.change(fileInput, { target: { files: [new File(['x'], 'x.png', { type: 'image/png' })] } });
  fireEvent.click(button);

  expect(screen.getByText(/generating your story/i)).toBeInTheDocument();
});
// END Day 4 Step 2a
```

### 2b. **Implement Only What’s Needed**

Add state `isWorking`, update button’s onClick:

```tsx
// Inside UploadPage component:
const [isWorking, setIsWorking] = useState(false);

return (
  <main>
    {/* ...previous fields... */}
    <button
      disabled={!name.trim() || !file}
      onClick={() => setIsWorking(true)}
    >
      Next
    </button>
    {isWorking && <div>Generating your story...</div>}
  </main>
);
```

Tests pass—move forward.

***

## 3. 🚩 **Third Baby Step: Display Story Results from Service** (Red → Green)

### 3a. **Write the Test**

Add one more test:

```tsx
// BEGIN Day 4 Step 3a: Test for generated story content and image

it('shows the generated story chapter and illustration after processing', async () => {
  // Mock fetch
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      story: [
        { chapter: 1, text: 'Alex climbed a mountain', imageUrl: '/c1.png' }
      ]
    }),
  });

  render(<UploadPage />);
  fireEvent.change(screen.getByLabelText(/child.*name/i), { target: { value: 'Alex' } });
  fireEvent.change(screen.getByLabelText(/choose file/i), {
    target: { files: [new File(['x'], 'pic.png', { type: 'image/png' })] }
  });
  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  await waitFor(() =>
    expect(screen.getByText(/alex climbed a mountain/i)).toBeInTheDocument()
  );
  expect(screen.getByAltText(/chapter 1 illustration/i)).toHaveAttribute('src', '/c1.png');
});
// END Day 4 Step 3a
```

### 3b. **Production and Service Code for This Test**

1. **Add service file:**  
   `src/services/storybookService.ts`

```ts
export async function generateStorybook({ file, name }: {file: File; name: string;}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);
  const res = await fetch('/api/storybook', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Failed');
  return await res.json();
}
```

2. **Update component:**  
Add new state and logic in `UploadPage`:

```tsx
import { generateStorybook } from '@/services/storybookService';

const [story, setStory] = useState<{ chapter: number; text: string; imageUrl: string }[] | null>(null);

async function handleGenerate() {
  setIsWorking(true);
  setStory(null);
  const result = await generateStorybook({ file, name });
  setStory(result.story);
  setIsWorking(false);
}

<button disabled={!name.trim() || !file} onClick={handleGenerate}>Next</button>
{isWorking && <div>Generating your story...</div>}
{story && (
  <div>
    {story.map(ch => (
      <div key={ch.chapter}>
        <h3>Chapter {ch.chapter}</h3>
        <p>{ch.text}</p>
        <img src={ch.imageUrl} alt={`Chapter ${ch.chapter} illustration`} />
      </div>
    ))}
  </div>
)}
```

You have now only exactly what is needed for the implemented steps!

***

## 4. 🚩 **Fourth Baby Step: Error Handling** (Red → Green)

### 4a. **Write the Test**

```tsx
// BEGIN Day 4 Step 4a: Test error state if API fails

it('shows an error if the story generation fails', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 500,
    json: async () => ({ error: 'fail!' }),
    text: async () => 'fail!',
  });

  render(<UploadPage />);
  fireEvent.change(screen.getByLabelText(/child.*name/i), { target: { value: 'Alex' } });
  fireEvent.change(screen.getByLabelText(/choose file/i), { target: { files: [new File(['x'], 'err.png', { type: 'image/png' })] } });
  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  await waitFor(() => expect(screen.getByText(/something went wrong/i)).toBeInTheDocument());
});
// END Day 4 Step 4a
```

### 4b. **Only Add This to Component**

Add:

```tsx
const [error, setError] = useState<string | null>(null);

async function handleGenerate() {
  setIsWorking(true);
  setError(null);
  try {
    const result = await generateStorybook({ file, name });
    setStory(result.story);
  } catch {
    setError('Something went wrong. Please try again later.');
  }
  setIsWorking(false);
}

{error && <div>{error}</div>}
```

***

## Final TDD Practice Reminders

- **Do not add UI/logic until the test drives it.**
- **Keep every new field, label, and behavior strictly in sync test→code→test.**
- **If you need to “refactor” or reorder for cleanliness, do it after all tests pass (blue).**
- **If a test fails for a missing label—it means you never coded to make it real. Add minimal code for it and continue.**

***

**Would you like any file as a complete copy-paste dump, help with the actual API mock details, or a further deep dive on TDD micro steps for another feature?**  
You are learning TDD the right way—one tiny, verifiable increment at a time!