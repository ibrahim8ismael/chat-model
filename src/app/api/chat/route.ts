import { GoogleGenerativeAI, GenerateContentResponse } from '@google/generative-ai';

// Get the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables. Please create a .env.local file and add it.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Function to convert the stream from the Gemini API to a format that can be sent over HTTP
async function* streamToGenerator(stream: AsyncGenerator<GenerateContentResponse>) {
  for await (const chunk of stream) {
    const chunkText = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
    if (chunkText) {
      yield chunkText;
    }
  }
}

// Function to create a ReadableStream from an async generator
function generatorToReadableStream(generator: AsyncGenerator<string>): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for await (const value of generator) {
        controller.enqueue(encoder.encode(value));
      }
      controller.close();
    },
  });
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: { message: 'Message is required' } }), { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContentStream(message);

    // Convert the stream to a format we can send
    const generator = streamToGenerator(result.stream);
    const readableStream = generatorToReadableStream(generator);

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache, no-transform',
      },
    });

  } catch (error: unknown) {
    console.error('Error in Gemini API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: { message: errorMessage } }), { status: 500 });
  }
}
