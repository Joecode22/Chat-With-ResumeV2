import OpenAI from 'openai';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

module.exports = async (req, res) => {
  const prompt = req.body.prompt;

  console.log('Request body:', req.body); // Log the request body

  try {
    const completionStream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt}
      ],
      stream: true,
    });

    // Set the headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of completionStream) {
      if (chunk.choices && chunk.choices[0] && chunk.choices[0].delta && typeof chunk.choices[0].delta.content === 'string') {
        // Send the chunk as a Server-Sent Event
        res.write(`data: ${JSON.stringify({ choices: [{ message: { content: chunk.choices[0].delta.content } }] })}\n\n`);
      }
    }

    res.end();
  } catch (error) {
    console.error('Error from OpenAI API:', error);
    res.status(500).json({ error: 'Error from OpenAI API' });
  }
};
