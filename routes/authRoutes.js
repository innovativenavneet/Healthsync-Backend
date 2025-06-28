const express = require('express');
const router = express.Router();
const {signup, login, googleLogin} = require('../controllers/authController');
const { route } = require('./mailerRoutes');

router.post('/signup',signup);

router.post('/login',login);

router.post('/gooleLogin',googleLogin);

module.exports= router;