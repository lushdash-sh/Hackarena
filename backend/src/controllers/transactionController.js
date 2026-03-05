const { Transaction, User } = require('../models');
const TransactionService = require('../services/TransactionService');

const transactionController = {
  /**
   * POST /api/transactions/simulate
   * Issue #1: Mock Transaction Generator
   * Generates a dummy purchase and saves raw transaction data.
   * No rounding applied — that will be Issue #2.
   */
  async simulateTransaction(req, res) {
    try {
      const { userId } = req.body;

      // Verify user exists
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      // Issue #1: Generate raw mock transaction (merchant + amount + category)
      const mockPurchase = TransactionService.generateMockTransaction(userId);

      // Save raw transaction to database (no rounding yet)
      const transaction = await Transaction.create(mockPurchase);

      res.status(201).json({
        success: true,
        data: {
          transaction,
          message: `Purchase: "${mockPurchase.merchantName}" - $${mockPurchase.originalAmount}`,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET /api/transactions/:userId - Get all transactions for a user
  async getUserTransactions(req, res) {
    try {
      const transactions = await Transaction.findAll({
        where: { userId: req.params.userId },
        order: [['createdAt', 'DESC']],
      });
      res.json({ success: true, data: transactions });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

module.exports = transactionController;
