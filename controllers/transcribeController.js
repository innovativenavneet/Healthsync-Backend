const fs = require('fs');
const client = require('../config/cloudConfig');

const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      console.error('No file received in the request');
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const filePath = req.file.path;
    console.log('Audio file received at:', filePath);

    const audioBytes = fs.readFileSync(filePath).toString('base64');
    const audio = { content: audioBytes };

  const config = {
  encoding: 'WEBM_OPUS',
  sampleRateHertz: 48000,
  languageCode: 'en-US'
};


    const [response] = await client.recognize({ audio, config });

    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    fs.unlinkSync(filePath);  
    console.log('Transcription successful');

    res.json({ success: true, transcript: transcription });

  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
};

module.exports = { transcribeAudio };
