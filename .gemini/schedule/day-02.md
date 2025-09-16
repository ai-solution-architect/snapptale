Certainly! Here's a detailed, beginner-friendly, step-by-step guide to implement **file upload and live image preview in Snapptale** during Day 2, complete with tests using React, Next.js App Router, Tailwind CSS, and Jest with React Testing Library.

***

# Snapptale — Day 2 Guide  
### Implement File Upload & Live Image Preview (with Tests)  
*Goal: Enable user to select a file and preview it before proceeding*

***

## What You Will Build Today

- A working file input where users can select an image  
- Display a live preview of the selected image on the Upload page  
- Enable the Next button only after a valid image is chosen  
- Write tests first (TDD) to validate this functionality  
- Keep clean modular code compatible with TypeScript and your setup

***

## Step-by-step Tutorial (approx 2 hours)

***

### 1. Create a New Test for Upload Page

Create (or overwrite) `tests/upload.test.tsx` with the following content, inside your project root:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import UploadPage from '@/app/upload/page';

describe('Upload Page', () => {
  it('renders file input and Next button disabled initially', () => {
    render(<UploadPage />);
    expect(screen.getByRole('heading', { name: /upload photo/i })).toBeInTheDocument();
    const input = screen.getByLabelText(/choose file/i) || screen.getByTestId('file-input');
    const button = screen.getByRole('button', { name: /next/i });
    expect(input).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('enables Next button and shows preview on valid image selection', () => {
    render(<UploadPage />);
    const input = screen.getByLabelText(/choose file/i) || screen.getByTestId('file-input');
    const button = screen.getByRole('button', { name: /next/i, });
    
    // Create a mock file (PNG image)
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    // Fire input change with the mock file
    fireEvent.change(input, { target: { files: [file] } });

    expect(button).toBeEnabled();
    expect(screen.getByAltText(/preview/i)).toBeInTheDocument();
  });
});
```

***

### 2. Update Upload Page Component to Implement Functionality

Open or create `/src/app/upload/page.tsx` and replace its content with:

```tsx
'use client'; // Needed to enable client-side interactivity in Next.js App Router

import React, { useState } from 'react';
import { useFilePreview } from '@/hooks/useFilePreview'; // Import the custom hook

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const previewSrc = useFilePreview(file); // Use the custom hook

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8'>
      <h1 className='text-4xl font-bold mb-6'>Upload Photo</h1>

      {/* File Input */}
      <label htmlFor='file-input' className='sr-only'>Choose file</label>
      <input
        id='file-input'
        type='file'
        accept='image/*'
        onChange={onFileChange}
        aria-label='Choose file'
        data-testid='file-input'
        className='border border-gray-400 p-2 rounded mb-6'
      />

      {/* Image Preview */}
      {previewSrc && (
        <div className='mb-6 border border-gray-300 p-2 rounded max-w-xs'>
          <img src={previewSrc} alt='Preview' className='max-w-full h-auto rounded' />
        </div>
      )}

      {/* Next Button */}
      <button
        disabled={!file}
        className={`px-6 py-3 rounded text-white transition ${
          file
            ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Next
      </button>
    </main>
  );
}
```

***

### 3. Run Your Tests Frequently

Run tests to validate your implementation:

```bash
npm test
```

All tests should now pass, confirming that:

- The upload page renders correctly with heading, input, and disabled button initially  
- Choosing an image enables the Next button and shows the preview

***

### 4. Run Development Server & Manual Check

Start dev server:

```bash
npm run dev
```

- Visit: [http://localhost:3000/upload](http://localhost:3000/upload)  
- Select an image file and verify the live preview appears  
- Verify the Next button is enabled only after a file is selected

***

### 5. Commit Your Work

Once satisfied, commit with a clear message:

```bash
git add src/app/upload/page.tsx tests/upload.test.tsx
git commit -m "Implement file upload and live image preview with tests"
```

***

### Summary & Coach Tips

- The file preview logic is now encapsulated in the `useFilePreview` custom hook, improving component readability and reusability.
- Using React `useState` enables storing file state.
- Writing tests first ensures you know exactly what behaviors to implement.
- React Testing Library queries by ARIA roles and labels for robust testing.
- `data-testid` is used only when accessibility queries don’t perfectly fit file inputs.
- Always revoke object URLs to avoid memory leaks.
- Use `aria-label` for accessibility and testability purposes.
- The Next.js App Router requires `'use client'` directive in client components.
- Run tests often, fix issues immediately for smooth progress.
- **Custom Hook Testing Strategy:** The `useFilePreview` hook is implicitly tested through the `UploadPage` component's integration tests, which verify the button enabling and preview display.  

***

### Next Steps

When ready, you can ask:

- *“Guide me through Day 3: backend file upload API and NanoBanana integration”*  
- *“Help me implement story generation and book rendering UI”*  

***

If you want, I can provide pre-written test and component files you can copy-paste to accelerate today’s coding.

Keep going; you’re doing great! 😊🚀