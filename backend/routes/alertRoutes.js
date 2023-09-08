const express = require('express');
const requireAuth = require('../middleware/requireAuth');

const { getAlerts, createAlert, deleteAlert } = require('../controllers/alertController');

const router = express.Router();

router.use(requireAuth);

router.get('/', getAlerts);
router.post('/', createAlert);
router.delete('/:id', deleteAlert);

module.exports = router;
