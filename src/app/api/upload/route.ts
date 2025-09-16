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

        const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
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