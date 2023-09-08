const express = require('express');
const { getStocks, createStock, deleteStock, updateStock } = require('../controllers/stockController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.get('/', getStocks);
router.post('/', createStock);
router.delete('/:id', deleteStock);
router.patch('/:id', updateStock);

module.exports = router;
