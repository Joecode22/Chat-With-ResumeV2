const openai = require('openai');

module.exports = async (req, res) => {
  console.log('Received request for /api/generate');

  const prompt = req.query.prompt;
  console.log(`Prompt value: ${prompt}`);

  // Assuming you're using the OpenAI API
  try {
    console.log('Sending request to OpenAI API');
    const result = await openai.ChatCompletion.create({
      model: 'text-davinci-002',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    console.log('Received response from OpenAI API');
    console.log(`Response: ${JSON.stringify(result)}`);

    res.status(200).send(result);
  } catch (error) {
    console.error('Error while processing request:', error);
    res.status(500).send({ error: 'An error occurred while processing your request.' });
  }
};