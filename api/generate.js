import OpenAI from 'openai';
import { Readable } from 'stream';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime edge
export const runtime = 'edge';

// Create a readable stream from an async generator
function createReadableStream(asyncIterable) {
  const readable = new Readable({
    read() {
      (async () => {
        for await (const chunk of asyncIterable) {
          this.push(chunk.choices[0].delta.content);
        }
        this.push(null);
      })();
    }
  });

  return readable;
}

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

    const stream = createReadableStream(response);

    // Pipe the stream to the response
    stream.pipe(res);
  } catch (error) {
    console.error('Error from OpenAI API:', error); // Log the error
    res.status(500).json({ error: 'Error from OpenAI API' });
  }
};