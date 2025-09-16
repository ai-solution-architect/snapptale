# Snapptale — Day 3 Backend API & NanoBanana Integration (Beginner + TDD)

***

## Overview

You will:
- Write a new API endpoint at `src/app/api/upload/route.ts`
- Update your frontend `/src/app/upload/page.tsx` to POST the file
- Show the AI-generated illustration after upload
- Propose and update your test in `/tests/upload.test.tsx`

***

## 1. Add/Update the Upload Page Integration Test

**Edit `/tests/upload.test.tsx`:**

Add a new test at the bottom of the file, just before the ending `});`.

```tsx
// BEGIN Day 3: Integration test for file upload and NanoBanana illustration
it('uploads an image and displays the NanoBanana AI generated illustration', async () => {
  render(<UploadPage />);
  const input = screen.getByLabelText(/choose file/i) || screen.getByTestId('file-input');
  const button = screen.getByRole('button', { name: /next/i });

  // Mock file selection
  const file = new File(['(image-content)'], 'child.png', { type: 'image/png' });
  fireEvent.change(input, { target: { files: [file] } });

  // Mock fetch for /api/upload
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ imageUrl: '/nanobanana-generated/fake.png' }),
  } as Response);

  fireEvent.click(button);

  // Wait for image to be displayed
  await waitFor(() =>
    expect(screen.getByAltText(/ai-generated illustration/i)).toBeInTheDocument()
  );
  expect(screen.getByAltText(/ai-generated illustration/i)).toHaveAttribute(
    'src',
    expect.stringContaining('/nanobanana-generated')
  );
});
// END Day 3: Integration test for file upload and NanoBanana illustration
```
**(You will need to `import waitFor` and possibly adjust your mocks depending on your Jest config.)**

***

## 2. Create the API Route: `/src/app/api/upload/route.ts`

**Create the following file from scratch:**

```ts
// BEGIN Day 3: New Next.js API route for file upload and Google AI (Gemini) integration

import { NextRequest, NextResponse } from 'next/server';

// Ensure the Google API Key is set
if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY environment variable not set.');
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Step 1: Convert the file to a Base64-encoded data for the API request
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    // Google AI API endpoint for Gemini-2.5-flash-image-preview
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent";
    const promptText = "Create a new image based on the uploaded one, in the style of a whimsical children's storybook illustration. The new image should be vibrant and friendly.";

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: promptText
            },
            {
              inlineData: {
                mimeType: file.type,
                data: base64Image,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': process.env.GOOGLE_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Google AI API Error: ${response.status} ${response.statusText} - ${errorBody}`);
      return NextResponse.json({ error: `AI image generation failed: ${errorBody}` }, { status: response.status });
    }

    const jsonResponse = await response.json();

    // Step 3: Extract the generated image data from the response
    const imageResultPart = jsonResponse.candidates?.[0]?.content?.parts?.[0];

    if (!imageResultPart || !('inlineData' in imageResultPart)) {
      console.error('Google AI API Error: No image data in response', jsonResponse);
      return NextResponse.json({ error: 'AI image generation failed to return an image.' }, { status: 500 });
    }

    // Step 4: Return the Base64 image data and mime type
    return NextResponse.json({
      imageData: imageResultPart.inlineData.data,
      mimeType: imageResultPart.inlineData.mimeType,
    });

  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
// END Day 3: New Next.js API route for file upload and Google AI (Gemini) integration
```

**Other notes:**
- Put your Google AI API key as `GOOGLE_API_KEY` in your `.env.local` (never commit secrets).

***

## 3. Update `/src/app/upload/page.tsx` for File Upload, POST, and Image Display

**Open `src/app/upload/page.tsx` and update as follows:**  
(Insert comments as shown to make the changes clear.)

```tsx
'use client';

import React, { useState } from 'react';
import { useFilePreview } from '@/hooks/useFilePreview';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [aiImgUrl, setAiImgUrl] = useState<string | null>(null); // BEGIN new state for Day 3
  const [isUploading, setIsUploading] = useState(false);         // BEGIN new state for Day 3 loading indication

  const previewSrc = useFilePreview(file);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setAiImgUrl(null); // Clear previous result if new file chosen
    }
  };

  // BEGIN Day 3: Function to POST file and set AI img URL
  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setIsUploading(false);
    if (data.imageUrl) {
      setAiImgUrl(data.imageUrl);
    }
    // TODO: else handle error
  };
  // END Day 3 upload logic

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6">Upload Photo</h1>

      <label htmlFor="file-input" className="sr-only">Choose file</label>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        aria-label="Choose file"
        data-testid="file-input"
        className="border border-gray-400 p-2 rounded mb-6"
      />

      {previewSrc && (
        <div className="mb-6 border border-gray-300 p-2 rounded max-w-xs">
          <img src={previewSrc} alt="Preview" className="max-w-full h-auto rounded" />
        </div>
      )}

      {/* BEGIN Day 3: Next button triggers file upload */}
      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={`px-6 py-3 rounded text-white transition ${
          file && !isUploading
            ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Next'}
      </button>
      {/* END Day 3: Next button triggers file upload */}

      {/* BEGIN Day 3: Display AI-generated illustration */}
      {aiImgUrl && (
        <div className="mt-4">
          <img
            src={aiImgUrl}
            alt="AI-generated illustration"
            className="max-w-full rounded"
          />
        </div>
      )}
      {/* END Day 3: Display AI-generated illustration */}
    </main>
  );
}
```

***

### Key Points  
- **Test first:** Add the new test before implementing!  
- **API route:** Add `/api/upload/route.ts` as shown.  
- **Frontend:** Adjust state, POST logic, and display logic blocks.
- **Environment:** Put your NanoBanana API key in `.env.local` as `NANOBANANA_API_KEY`.

***

## Review Checklist (before moving to Day 4):

- [ ] New/updated test in `tests/upload.test.tsx` — passes!
- [ ] API route file: `src/app/api/upload/route.ts` exists and works (see logs for errors)
- [ ] Frontend page: `src/app/upload/page.tsx` handles POST and shows AI result
- [ ] All user-facing text and attributes are testable (for screen readers and Testing Library)
- [ ] No secrets/keys in code or git—use `.env.local` only

***

When ready, run:
```bash
npm test
npm run dev
```
…and see your workflow in action!  
If anything’s unclear, or you want copy-ready file content for your hooks, tests, or error handling, just ask—I'm here to help you build with confidence!

[1](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/30392355/7c310650-14e1-44ba-bbac-2ca033f82976/GEMINI.md)
[2](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/30392355/ac7a1c87-c294-4fa9-a193-45ac48dddf93/00-project-structure.md)
[3](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/30392355/fa5d067a-a93d-4452-8380-b4b7d3ddaeb6/00-snapptale-implementation-plan.md)
[4](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/30392355/9c40adbe-1d1b-4cb6-b287-620d53132eda/day-01.md)
[5](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/30392355/437135bf-5f74-459a-97d4-9f4f83df2e3b/day-02.md)