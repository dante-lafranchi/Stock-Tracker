const express = require('express');
const { sendOTP, verifyOTP, sendMessage } = require('../controllers/twilioSMSController');

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/send-message', sendMessage);

module.exports = router;
