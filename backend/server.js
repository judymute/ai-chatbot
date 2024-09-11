const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let faqContent = '';

app.use(cors());
app.use(express.json());

// Endpoint to upload and parse PDF
app.post('/upload-faq', upload.single('file'), async (req, res) => {
  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).send('No file uploaded.');
  }

  try {
    console.log('Reading file:', req.file.path);
    const dataBuffer = fs.readFileSync(req.file.path);
    console.log('Parsing PDF');
    const data = await pdf(dataBuffer);
    faqContent = data.text;
    console.log('FAQ content updated');
    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);
    res.send('FAQ uploaded and parsed successfully.');
  } catch (error) {
    console.error('Error parsing PDF:', error);
    res.status(500).send('Error parsing PDF: ' + error.message);
  }
});

// Endpoint to handle chat requests
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  console.log('Received message:', message);

  if (!faqContent) {
    console.log('FAQ content is empty');
    return res.status(400).send('FAQ has not been uploaded yet.');
  }

  try {
    console.log('Sending request to OpenAI');
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": `You are a helpful assistant. Answer questions based on the following FAQ: ${faqContent}`},
        {"role": "user", "content": message}
      ],
    });
    console.log('Received response from OpenAI');
    res.json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).send('Error generating response: ' + error.message);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));