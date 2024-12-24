import { OpenAIStream } from '@/libs/OpenAIStream';

export const runtime = 'edge';

export async function POST(req) {
  const { title, name, email } = await req.json();

  const prompt = `Write a professional email to ${name} (${email}) based on the title "${title}". The email should be at least 200 words long and discuss a nice thing that happened at work. Make sure the tone is friendly and engaging.`;

  const payload = {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 500,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}