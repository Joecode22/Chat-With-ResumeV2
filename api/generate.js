const OpenAI = require('openai');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

module.exports = async (req, res) => {
  const prompt = req.body.prompt;

  console.log('Request body:', req.body); // Log the request body

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    console.log('Response from OpenAI API:', completion); // Log the response from the OpenAI API

    if (!Array.isArray(completion.choices) || completion.choices.length === 0 || typeof completion.choices[0].message !== 'object' || typeof completion.choices[0].message.content !== 'string') {
      res.status(500).json({ error: 'Unexpected response format from OpenAI API' });
      return;
    }

    res.status(200).json(completion);
  } catch (error) {
    console.error('Error from OpenAI API:', error);
    res.status(500).json({ error: 'Error from OpenAI API' });
  }
};
