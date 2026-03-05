const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// POST /api/transactions/simulate - Simulate a transaction (Issue #3)
router.post('/simulate', transactionController.simulateTransaction);

// GET /api/transactions/:userId - Get all transactions for a user
router.get('/:userId', transactionController.getUserTransactions);

module.exports = router;
