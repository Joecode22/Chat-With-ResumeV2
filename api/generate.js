import OpenAI from 'openai';
import { OpenAIStream } from 'ai';

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

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of stream) {
      console.log('Data chunk from OpenAI API:', chunk);
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error('Error from OpenAI API:', error); // Log the error
    res.status(500).json({ error: 'Error from OpenAI API' });
  }
};