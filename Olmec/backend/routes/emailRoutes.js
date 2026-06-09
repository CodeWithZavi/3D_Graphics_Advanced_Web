const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/emailController');
const authenticateToken = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: 'Too many email requests, please try again later.' }
});

router.post('/send-email', authenticateToken, emailLimiter, sendEmail);

module.exports = router;
