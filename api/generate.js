import OpenAI from 'openai';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// export const runtime = 'edge';

// Read the resume.txt file
const resume = fs.readFileSync(path.join(__dirname, 'resume.txt'), 'utf8');

function createReadableStream(asyncIterable) {
  let i = 0;
  const readable = new Readable({
    read() {
      (async () => {
        for await (const chunk of asyncIterable) {
          if (chunk.choices && chunk.choices[0].delta && chunk.choices[0].delta.content) {
            const timestamp = new Date().toISOString();
            // console.log(`[${timestamp}] Pushing data to stream:`, chunk.choices[0].delta.content);
            this.push((i++ ? ',\n' : '[') + JSON.stringify(chunk)); // Add newline character after each JSON object
          }
        }
        this.push('\n]'); // Send the closing bracket with a newline character
        this.push(null);
      })();
    }
  });

  return readable;
}

export default async function (req, res) {
  const prompt = req.query.prompt;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        { "role": "system", "content": "You are a helpful assistant that answers questions based on the following resume. If a question is not related to the following resume redirect the user to ask relevant questions or to use the random question button" },
        { "role": "user", "content": resume },
        { "role": "user", "content": prompt }
      ],
    });

    // Use .tee() to create two independent streams
    const [logStream, responseStream] = response.tee();

    // Log the response
    for await (const chunk of logStream) {
    }

    const stream = createReadableStream(responseStream);

    // Pipe the stream to the response
    stream.pipe(res);
  } catch (error) {
    console.error('Error from OpenAI API:', error); // Log the error
    res.status(500).json({ error: 'Error from OpenAI API' });
  }
};
