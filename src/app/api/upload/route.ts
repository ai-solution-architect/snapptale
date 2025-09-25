// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
// We import our new, decoupled AI service.
import { generateStory } from '@/lib/ai';
import { processImagePipeline } from '@/lib/ai/imagePipeline';

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
          
        if (!file || !name) {
            return NextResponse.json({ error: 'Missing file or name.' }, { status: 400 });
        }

        // Check if the file is too large (more than 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ 
                error: 'File too large', 
                details: 'Please upload an image smaller than 5MB.' 
            }, { status: 400 });
        }

        // Use our integrated image processing pipeline
        const pipelineResult = await processImagePipeline(name, file);

        return NextResponse.json(pipelineResult);

    } catch (error) {
        // We log the specific error to the console for debugging.
        console.error('[API ROUTE ERROR] Upload API Error:', error);

        // We return a generic error message to the user for security reasons.
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
    }
}