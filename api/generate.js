// backend api call to OpenAI
module.exports = async (req, res) => {
  const prompt = req.body.prompt;

  console.log('Request body:', req.body); // Log the request body

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

  console.log('Response from OpenAI API:', data); // Log the response from the OpenAI API

  // Check if the data contains the expected 'choices' array
  console.log('Data choices:', data.choices);
  if (!Array.isArray(data.choices) || data.choices.length === 0 || typeof data.choices[0].message !== 'object' || typeof data.choices[0].message.content !== 'string') {
    res.status(500).json({ error: 'Unexpected response format from OpenAI API' });
    return;
  }

  res.status(200).json(data);
};
