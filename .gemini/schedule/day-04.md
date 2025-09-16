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
// BEGIN Step 1b UploadPage: Add name state, input, and update button disabled prop

// Add this state alongside other useState declarations (e.g., after 'error' state):
const [name, setName] = useState('');

// Insert this HTML before the existing file input (<label htmlFor="file-input"...>):
<div className="mb-6">
  <label htmlFor="name-input" className="block text-sm font-medium text-gray-700">Child's Name</label>
  <input
    id="name-input"
    type="text"
    value={name}
    onChange={e => setName(e.target.value)}
    aria-label="Child's Name"
    className="mt-1 block w-full border border-gray-400 p-2 rounded shadow-sm"
  />
</div>

// Update the 'disabled' prop of the 'Next' button:
// Find the button with disabled={!file || isUploading} and change it to:
disabled={!name.trim() || !file || isUploading}

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

  expect(screen.getByText(/uploading.../i)).toBeInTheDocument();
});
// END Day 4 Step 2a
```

### 2b. **Implement Only What’s Needed**

Add state `isWorking`, update button’s onClick:

```tsx
// Inside UploadPage component:
// (No new state needed, 'isUploading' already exists)

// Update the 'onClick' handler of the 'Next' button:
// The 'handleUpload' function already sets 'isUploading'
// (No new loading div needed, 'isUploading' already controls button text)
```

Tests pass—move forward.

***

## 3. 🚩 **Third Baby Step: Display Story Results from Service** (Red → Green)

### 3a. **Write the Test**

Add one more test:

```tsx
// BEGIN Day 4 Step 3a: Test for generated story content and image

it('shows the generated story chapter and illustration after processing', async () => {
  // Mock fetch to return story with base64 image data
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      story: [
        {
          chapter: 1,
          text: 'Alex climbed a mountain.',
          imageData: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // A 1x1 transparent PNG base64
          mimeType: 'image/png',
        }
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
    expect(screen.getByText(/alex climbed a mountain./i)).toBeInTheDocument()
  );
  expect(screen.getByAltText(/chapter 1 illustration/i)).toHaveAttribute(
    'src',
    expect.stringContaining('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=')
  );
});
// END Day 4 Step 3a
```

### 3b. **Production and Service Code for This Test**

1. **Update existing `handleUpload` function in `/src/app/upload/page.tsx`:
       (No new service file needed; continue using `/api/upload`)

       **Add `name` to `FormData` in `handleUpload`:**
       ```typescript
       // Inside handleUpload function:
       formData.append('name', name); // Add this line
       ```

       **Update `handleUpload` to process story response:**
       (This logic is already present in `src/app/upload/page.tsx` from Day 3 updates)
       ```typescript
       // Inside handleUpload function, after 'const data = await res.json();':
       if (data.story && Array.isArray(data.story)) {
         setStory(data.story);
         setAiImgUrl(null); // Clear single image if story is generated
       } else if (data.imageData && data.mimeType) {
         const dataUri = `data:${data.mimeType};base64,${data.imageData}`;
         setAiImgUrl(dataUri);
         setStory(null); // Clear story if single image is generated
       } else {
         throw new Error('Upload succeeded, but the response was invalid.');
       }
       ```

    2. **Update `src/app/api/upload/route.ts` to generate story:**
       (This will be the next major implementation step, after the guide is synced)
       *   Extract `name` from `formData`.
       *   Modify Google AI API call to generate a story based on `file` and `name`.
       *   Return a `story` array in the response.
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

  await waitFor(() => expect(screen.getByText(/upload failed. please try again./i)).toBeInTheDocument());
});
// END Day 4 Step 4a
```

### 4b. **Only Add This to Component**

Add:

```tsx
// Error handling is already implemented in handleUpload and displayed in JSX.
// (No new state or logic needed for this step)
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