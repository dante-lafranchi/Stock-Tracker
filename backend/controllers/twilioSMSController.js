const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const User = require('../models/userModel');
const validator = require('validator');

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const sendOTP = async (req, res) => {
    const { phoneNumber } = req.body;

    if (!validator.isMobilePhone(phoneNumber)) {
        return res.status(400).json({ error: 'Phone number is not valid' });
    }

    try {
        const otpResponse = await client.verify.v2.services(TWILIO_SERVICE_SID).verifications.create({
            to: `+${phoneNumber}`,
            channel: 'sms',
        });

        res.status(200).json({ message: 'OTP sent successfully', otpResponse });
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
};

const verifyOTP = async (req, res) => {
    const { phoneNumber, otp } = req.body;

    try {
        const verifiedResponse = await client.verify.v2.services(TWILIO_SERVICE_SID).verificationChecks.create({
            to: `+${phoneNumber}`,
            code: otp,
        });

        res.status(200).json({ message: 'OTP verified successfully', verifiedResponse });
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
};

const sendMessage = async (req, res) => {
    const { ticker, alertPrice, user } = req.body;

    let phoneNumber = user.phoneNumber;

    const message = `Your alert for ${ticker} has been triggered. The current price is ${alertPrice}.`;

    try {
        client.messages.create({ body: `${message}`, from: process.env.TWILIO_PHONE_NUMBER, to: `+${phoneNumber}` });

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
};

module.exports = {
    sendOTP,
    verifyOTP,
    sendMessage,
};
