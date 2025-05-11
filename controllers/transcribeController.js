const fs = require('fs');
const client = require('../config/cloudConfig');

const transcribeAudio = async (req, res) => {
  try {
    const filePath = req.file.path;
    
    // Load the audio file
    const audioBytes = fs.readFileSync(filePath).toString('base64');
    
    const audio = {
      content: audioBytes
    };

    const config = {
      encoding: 'LINEAR16',         
      sampleRateHertz: 16000,
      languageCode: 'en-US'
    };

    const [response] = await client.recognize({
      audio,
      config
    });

    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    fs.unlinkSync(filePath);  // Clean up temporary file

    res.json({ success: true, transcript: transcription });

  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
};

module.exports = { transcribeAudio };
