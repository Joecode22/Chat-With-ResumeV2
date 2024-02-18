import OpenAI from 'openai';
import { OpenAIStream } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
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

    console.log("the response is: ", response); // Log the response

    const stream = OpenAIStream(response);

    // Pipe the stream to the response
    stream.pipe(res);
  } catch (error) {
    console.error('Error from OpenAI API:', error); // Log the error
    res.status(500).json({ error: 'Error from OpenAI API' });
  }
};