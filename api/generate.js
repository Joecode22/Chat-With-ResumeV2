const OpenAI = require('openai');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

module.exports = async (req, res) => {
  const prompt = req.body.prompt;

  console.log('Request body:', req.body); // Log the request body

  try {
    const completionStream = openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    let responseText = '';

    for await (const chunk of completionStream) {
      if (chunk.choices && chunk.choices[0] && chunk.choices[0].message && typeof chunk.choices[0].message.content === 'string') {
        responseText += chunk.choices[0].message.content;
      }
    }

    res.status(200).json({ choices: [{ message: { content: responseText } }] });
  } catch (error) {
    console.error('Error from OpenAI API:', error);
    res.status(500).json({ error: 'Error from OpenAI API' });
  }
};
