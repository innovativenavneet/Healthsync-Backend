const express = require('express');
const { sendMail } = require('../controllers/mailerController');

const router = express.Router();
router.post('/', sendMail);

module.exports = router;
