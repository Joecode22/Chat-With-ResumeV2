// backend api call to OpenAI
module.exports = async (req, res) => {
  const prompt = req.body.prompt;

  // Fetch the response from the OpenAI API
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      stream: true, // For streaming responses
    }),
  });

  const data = await response.json();

  // Check if the data contains the expected 'choices' array
  if (!Array.isArray(data.choices) || data.choices.length === 0 || typeof data.choices[0].message !== 'object' || typeof data.choices[0].message.content !== 'string') {
    res.status(500).json({ error: 'Unexpected response format from OpenAI API' });
    return;
  }

  res.status(200).json(data);
};
