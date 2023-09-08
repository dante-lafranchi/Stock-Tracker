const Alert = require('../models/alertModel');
const mongoose = require('mongoose');
const WebSocketManager = require('../websocket/WebSocketManager');

const getAlerts = async (req, res) => {
    const userId = req.user._id;

    const alerts = await Alert.find({ userId }).sort({ ticker: 1 });

    res.status(200).json(alerts);
};

const createAlert = async (req, res) => {
    const { companyName, ticker, alertPrice } = req.body;

    try {
        const userId = req.user._id;
        const alert = await Alert.create({ companyName, ticker, alertPrice, userId });

        const response = await fetch(
            `https://api.twelvedata.com/price?symbol=${ticker}&apikey=${process.env.TWELVE_DATA_API_KEY}`
        );
        const data = await response.json();
        const tradingPrice = data.price;

        const tradingPriceAboveAlertPrice = tradingPrice >= alertPrice;

        WebSocketManager.createAlert(userId, { ...alert, tradingPriceAboveAlertPrice });

        res.status(200).json(alert);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteAlert = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such alert' });
    }

    const alert = await Alert.findOneAndDelete({ _id: id });

    if (!alert) {
        return res.status(404).json({ error: "You don't have that alert." });
    }

    const userId = req.user._id;
    WebSocketManager.deleteAlert(userId, alert, true);

    res.status(200).json(alert);
};

module.exports = {
    getAlerts,
    createAlert,
    deleteAlert,
};
