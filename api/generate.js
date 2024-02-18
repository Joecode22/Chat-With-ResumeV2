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
  res.status(200).json(data);
};
