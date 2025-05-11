const speech = require('@google-cloud/speech');
const path = require('path');

const client = new speech.SpeechClient({
  keyFilename: path.join(__dirname, 'google-credentials.json')  
});

module.exports = client;
