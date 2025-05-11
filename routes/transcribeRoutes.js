const express = require('express');
const multer = require('multer');
const { transcribeAudio } = require('../controllers/transcribeController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('audio'), transcribeAudio);

module.exports = router;
