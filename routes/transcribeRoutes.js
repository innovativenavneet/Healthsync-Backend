const express = require('express');
const multer = require('multer');
const { transcribeAudio, getTranscriptions, getTranscriptionById } = require('../controllers/transcribeController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// All routes require authentication
router.use(requireAuth);

// Transcribe audio file
router.post('/', upload.single('audio'), transcribeAudio);

// Get all transcriptions for the authenticated user
router.get('/', getTranscriptions);

// Get a specific transcription by ID
router.get('/:id', getTranscriptionById);

module.exports = router;
