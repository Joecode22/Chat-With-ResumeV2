import OpenAI from 'openai';
import { Readable } from 'stream';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime edge
export const runtime = 'edge';

// Get the directory of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the resume.txt file
const resume = fs.readFileSync(`${__dirname}/resume.txt`, 'utf8');

function createReadableStream(asyncIterable) {
  let i = 0; // Define i here
  const readable = new Readable({
    read() {
      (async () => {
        for await (const chunk of asyncIterable) {
          if (chunk.choices && chunk.choices[0].delta && chunk.choices[0].delta.content) {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] Pushing data to stream:`, chunk.choices[0].delta.content);
            this.push((i++ ? ',\n' : '[') + JSON.stringify(chunk)); // Add newline character after each JSON object

            // Add a delay before pushing the next chunk
            await new Promise(resolve => setTimeout(resolve, 1000));
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

  console.log('Prompt:', prompt); // Log the prompt

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        { "role": "system", "content": "You are a helpful assistant." },
        { "role": "user", "content": resume },
        { "role": "user", "content": prompt }
      ],
    });

    // Use .tee() to create two independent streams
    const [logStream, responseStream] = response.tee();

    // Log the response
    for await (const chunk of logStream) {
      console.log(chunk);
    }

    const stream = createReadableStream(responseStream);

    // Pipe the stream to the response
    stream.pipe(res);
  } catch (error) {
    console.error('Error from OpenAI API:', error); // Log the error
    res.status(500).json({ error: 'Error from OpenAI API' });
  }
};