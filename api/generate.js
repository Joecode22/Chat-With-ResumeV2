import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Readable } from 'stream';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

export default async function (req, res) {
  const prompt = req.query.prompt;

  console.log('Prompt:', prompt); // Log the prompt

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        { "role": "system", "content": "You are a helpful assistant." },
        { "role": "user", "content": prompt }
      ],
    });

    const stream = OpenAIStream(response);
    const chunks = [];

    for await (const chunk of stream) {
      console.log('Data chunk from OpenAI API:', chunk);
      chunks.push(chunk);
    }

    const newStream = Readable.from(chunks);

    return new StreamingTextResponse(newStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error from OpenAI API:', error); // Log the error
    res.status(500).json({ error: 'Error from OpenAI API' });
  }
};