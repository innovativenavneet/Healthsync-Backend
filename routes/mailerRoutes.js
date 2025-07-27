const express = require('express');
const { sendMail, getPatientsForEmail } = require('../controllers/mailerController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get patients for email selection
router.get('/patients', getPatientsForEmail);

// Send email to a patient
router.post('/', sendMail);

module.exports = router;
