const express = require('express');
const router = express.Router();
const { getConfig, createOrder, verifySession } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.get('/config', getConfig);
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifySession);

module.exports = router;
