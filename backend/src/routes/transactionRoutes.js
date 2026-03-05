const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Issue #1 + #2: Simulate a mock purchase with dynamic rounding
router.post('/simulate', transactionController.simulateTransaction);

// Get all transactions for a user
router.get('/:userId', transactionController.getUserTransactions);

// Sub-Issue #2.5: Standalone round-up calculator (preview, no DB write)
router.post('/roundup/calculate', transactionController.calculateRoundUp);

// Sub-Issue #2.6: Get category multiplier config
router.get('/roundup/multipliers', transactionController.getMultipliers);

module.exports = router;
