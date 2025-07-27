const fs = require('fs');
const client = require('../config/cloudConfig');
const Transcription = require('../models/transcriptionModel');

const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      console.error('No file received in the request');
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const filePath = req.file.path;
    console.log('Audio file received at:', filePath);

    // Read the audio file
    const audioBytes = fs.readFileSync(filePath);
    const audio = { content: audioBytes.toString('base64') };

    // Detect audio format based on file extension
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    let encoding = 'WEBM_OPUS'; // default
    let sampleRateHertz = 48000; // default

    // Adjust encoding and sample rate based on file type
    switch (fileExtension) {
      case 'wav':
        encoding = 'LINEAR16';
        // Try to detect sample rate from WAV header or use common values
        sampleRateHertz = 44100; // Most common for WAV files
        break;
      case 'mp3':
        encoding = 'MP3';
        sampleRateHertz = 44100; // Most common for MP3
        break;
      case 'flac':
        encoding = 'FLAC';
        sampleRateHertz = 44100;
        break;
      case 'webm':
        encoding = 'WEBM_OPUS';
        sampleRateHertz = 48000;
        break;
      case 'm4a':
        encoding = 'MP3'; // M4A often works with MP3 encoding
        sampleRateHertz = 44100;
        break;
      default:
        encoding = 'WEBM_OPUS';
        sampleRateHertz = 48000;
    }

    const config = {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: 'en-US',
      enableAutomaticPunctuation: true,
      // Add alternative encodings for better compatibility
      alternativeLanguageCodes: ['en-US', 'en-GB']
    };

    console.log('Using config:', config);

    const [response] = await client.recognize({ audio, config });

    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    // Save transcription to database
    const transcriptionDoc = new Transcription({
      userId: req.user.id,
      patientId: req.body.patientId || null,
      originalFileName: req.file.originalname,
      transcript: transcription,
      audioFormat: fileExtension,
      status: 'completed'
    });

    await transcriptionDoc.save();

    // Clean up the uploaded file
    fs.unlinkSync(filePath);  
    console.log('Transcription saved to database successfully');

    res.json({ 
      success: true, 
      transcript: transcription,
      transcriptionId: transcriptionDoc._id
    });

  } catch (error) {
    console.error('Transcription error:', error);
    
    // Clean up file even if transcription fails
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Failed to cleanup file:', cleanupError);
      }
    }

    // Provide more specific error messages
    if (error.code === 16) {
      return res.status(401).json({ 
        error: 'Authentication failed. Please check your Google Cloud credentials.',
        details: error.message 
      });
    }

    if (error.code === 3) {
      return res.status(400).json({ 
        error: 'Audio format not supported. Please try a different audio file.',
        details: error.message 
      });
    }

    res.status(500).json({ 
      error: 'Failed to transcribe audio',
      details: error.message 
    });
  }
};

// Get all transcriptions for a user
const getTranscriptions = async (req, res) => {
  try {
    const transcriptions = await Transcription.find({ userId: req.user.id })
      .populate('patientId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, transcriptions });
  } catch (error) {
    console.error('Error fetching transcriptions:', error);
    res.status(500).json({ error: 'Failed to fetch transcriptions' });
  }
};

// Get a specific transcription
const getTranscriptionById = async (req, res) => {
  try {
    const transcription = await Transcription.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('patientId', 'name email');

    if (!transcription) {
      return res.status(404).json({ error: 'Transcription not found' });
    }

    res.json({ success: true, transcription });
  } catch (error) {
    console.error('Error fetching transcription:', error);
    res.status(500).json({ error: 'Failed to fetch transcription' });
  }
};

module.exports = { transcribeAudio, getTranscriptions, getTranscriptionById };
