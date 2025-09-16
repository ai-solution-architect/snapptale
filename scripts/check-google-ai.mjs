import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

async function checkGoogleAIApi() {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.error('Error: GOOGLE_API_KEY environment variable not set.');
    process.exit(1);
  }

  try {
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: "Hello, Gemini!"
            }
          ]
        }
      ]
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Google AI API health check failed: ${response.status} ${response.statusText} - ${errorBody}`);
      process.exit(1);
    }

    const jsonResponse = await response.json();

    if (jsonResponse.candidates && jsonResponse.candidates.length > 0) {
      console.log('Google AI API health check successful.');
      process.exit(0);
    } else {
      console.error('Google AI API health check failed: No content in response.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Google AI API health check failed with error:', error.message);
    process.exit(1);
  }
}

checkGoogleAIApi();