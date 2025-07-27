const mongoose = require('mongoose');

const transcriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: false
  },
  originalFileName: {
    type: String,
    required: true
  },
  transcript: {
    type: String,
    required: true
  },
  audioFormat: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transcription', transcriptionSchema); 