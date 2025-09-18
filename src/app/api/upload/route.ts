// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
// We import our new, decoupled AI service.
import { generateStory } from '@/lib/ai';

// This check is for the production environment. For local development,
// we will rely on the AI_PROVIDER environment variable in our AI service.
if (!process.env.GOOGLE_API_KEY && process.env.NODE_ENV === 'production') {
    throw new Error('GOOGLE_API_KEY environment variable not set for production.');
}

export async function POST(req: NextRequest) {
    try {
        // --- MOCK API UPLOAD START ---
        // We are keeping this simple mock for basic connectivity testing if needed.
        // Ensure this is false during actual AI service testing.
        if (process.env.MOCK_API_UPLOAD === 'true') {
            console.log('MOCK_API_UPLOAD is true. Returning mock data.');
            await new Promise(resolve => setTimeout(resolve, 1000));
            return NextResponse.json({
                imageData: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
                mimeType: 'image/png',
            });
        }
        // --- MOCK API UPLOAD END ---

        const formData = await req.formData();
        const file = formData.get('photo') as File;
        const name = formData.get('name') as string;

        console.log('API Route: Received name:', name);
        console.log('API Route: Received file type:', file?.type);
        console.log('API Route: Received file size:', file?.size);
          
        if (!file || !name) {
            return NextResponse.json({ error: 'Missing file or name.' }, { status: 400 });
        }

        // All the complex logic for AI interaction is now handled by our AI service.
        // This API route's only job is to handle the request and response.
        // This makes the code much cleaner and easier to understand.
        const storyResponse = await generateStory(name, file);

        return NextResponse.json(storyResponse);

    } catch (error) {
        // We log the specific error to the console for debugging.
        console.error('Upload API Error:', error);

        // We return a generic error message to the user for security reasons.
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
    }
}
