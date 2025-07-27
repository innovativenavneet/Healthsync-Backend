const speech = require('@google-cloud/speech');
const path = require('path');

// Try to use environment variable first, then fallback to key file
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, 'google-credentials.json');

const client = new speech.SpeechClient({
  keyFilename: credentialsPath
});

module.exports = client;
