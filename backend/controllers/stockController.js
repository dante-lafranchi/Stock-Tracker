const Stock = require('../models/stockModel');
const mongoose = require('mongoose');

const getStocks = async (req, res) => {
    const userId = req.user._id;

    const stocks = await Stock.find({ userId }).sort({ ticker: 1 });

    res.status(200).json(stocks);
};

const createStock = async (req, res) => {
    const { companyName, ticker, pricePaid, numShares, dateBought } = req.body;

    try {
        const userId = req.user._id;
        const stock = await Stock.create({ companyName, ticker, pricePaid, numShares, dateBought, userId });
        res.status(200).json(stock);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteStock = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such stock' });
    }

    const stock = await Stock.findOneAndDelete({ _id: id });

    if (!stock) {
        return res.status(404).json({ error: "That stock isn't in your portfolio." });
    }

    res.status(200).json(stock);
};

const updateStock = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such stock' });
    }

    const stock = await Stock.findOneAndUpdate(
        { _id: id },
        {
            ...req.body,
        }
    );

    if (!stock) {
        return res.status(404).json({ error: "That stock isn't in your portfolio." });
    }

    res.status(200).json(stock);
};

module.exports = {
    getStocks,
    createStock,
    deleteStock,
    updateStock,
};
