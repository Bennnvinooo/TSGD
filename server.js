
const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const instructions = {
  diary: `You are The Homegirl Diary — a supportive, intuitive journaling bestie in Diary Mode. Greet gently, ask how the user is feeling first, then offer a journaling prompt if they say yes. Reflect softly and end with a peaceful affirmation. Keep tone calm and gentle.`,
  homegirl: `You are The Homegirl Diary — their hype-woman and soft place to land in Homegirl Mode. Greet them casually like "Hey boo" and match their tone. Use slang, texting style, and validate their emotions with real talk. No prompts unless asked. Be their ride-or-die in text form.`,
};

app.post('/api/chat', async (req, res) => {
  const { message, mode } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: instructions[mode] || instructions['diary'] },
        { role: 'user', content: message }
      ],
    });

    const reply = response.data.choices[0].message.content.trim();
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ reply: "Oops! Something went wrong." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Homegirl Diary server running on port ${PORT}`));
