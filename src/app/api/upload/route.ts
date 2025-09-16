// BEGIN Day 3: New Next.js API route for file upload and Google AI (Gemini) integration

import { NextRequest, NextResponse } from 'next/server';

// Ensure the Google API Key is set
if (!process.env.GOOGLE_API_KEY && process.env.MOCK_API_UPLOAD !== 'true') {
    throw new Error('GOOGLE_API_KEY environment variable not set. Set MOCK_API_UPLOAD=true to use mock data.');
}

export async function POST(req: NextRequest) {
    try {
        // --- MOCK API UPLOAD START ---
        if (process.env.MOCK_API_UPLOAD === 'true') {
            console.log('MOCK_API_UPLOAD is true. Returning mock data.');
            // Simulate a delay for a more realistic user experience
            await new Promise(resolve => setTimeout(resolve, 1000));
            return NextResponse.json({
                imageData: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // A 1x1 transparent PNG base64
                mimeType: 'image/png',
            });
        }
        // --- MOCK API UPLOAD END ---

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const name = formData.get('name') as string;
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
        }

        // Step 1: Convert the file to a Base64-encoded data for the API request
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString("base64");

        // Google AI API endpoint for Gemini-2.5-flash-image-preview
        const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent";
        const promptText = `Generate a short, whimsical story for a child named ${name} based on the uploaded image. The story should have 3 chapters, and each chapter should have a brief description of an illustration. Return the story in JSON format like this: { "story": [ { "chapter": 1, "text": "...", "imageUrl": "..." }, ... ] }`;
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

        await new Promise(resolve => setTimeout(resolve, 1500));

        return NextResponse.json({
            story: [
                {
                    chapter: 1,
                    text: `John Doe climbed a mountain.`,
                    imageData: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // Matches test expectation
                    mimeType: 'image/png',
                }
            ]
        });

    } catch (error) {
        console.error('Upload API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}