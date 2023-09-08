const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '21d' });
};

const loginUser = async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
        const user = await User.login(phoneNumber, password);

        const token = createToken(user._id);

        res.status(200).json({ phoneNumber, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signupUser = async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
        const user = await User.signup(phoneNumber, password);

        const token = createToken(user._id);

        res.status(200).json({ phoneNumber, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    loginUser,
    signupUser,
};
