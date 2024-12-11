import { google } from "@ai-sdk/google";
import { convertToCoreMessages, streamText } from "ai";

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable');
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google("gemini-1.5-flash-latest"),
    system: "You are a teacher...",
    messages,
  });

  return result.toDataStreamResponse();
}
