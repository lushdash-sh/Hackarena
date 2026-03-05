const { Transaction, User } = require('../models');
const TransactionService = require('../services/TransactionService');
const RoundUpService = require('../services/RoundUpService');
const TrustScoreService = require('../services/TrustScoreService');

const transactionController = {
  /**
   * POST /api/transactions/simulate
   * Issue #1 + Issue #2 integrated:
   *   1. Generate a mock purchase (TransactionService)
   *   2. Categorize & apply dynamic rounding (RoundUpService)
   *   3. Store full transaction with roundedAmount, savedAmount, multiplier
   *   4. Update user's totalSaved
   */
  async simulateTransaction(req, res) {
    try {
      const { userId } = req.body;

      // Verify user exists
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      // Issue #1: Generate raw mock purchase (merchant + amount + category)
      const mockPurchase = TransactionService.generateMockTransaction(userId);

      // Issue #2: Pass through RoundUpService for dynamic rounding
      const roundUp = RoundUpService.calculateRoundUp(
        mockPurchase.originalAmount,
        mockPurchase.category
      );

      // Merge: raw purchase + rounding result
      const txData = {
        ...mockPurchase,
        roundedAmount: roundUp.roundedAmount,
        savedAmount: roundUp.savedAmount,
        roundUpMultiplier: roundUp.multiplier,
      };

      // Save complete transaction to database
      const transaction = await Transaction.create(txData);

      // Update user's total saved
      await user.increment('totalSaved', { by: roundUp.savedAmount });

      // Issue #3: Update streak and recalculate trust score
      await TrustScoreService.updateStreak(userId);

      const allTransactions = await Transaction.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
      });
      const updatedUser = await User.findByPk(userId);
      const trustResult = TrustScoreService.calculate(allTransactions, updatedUser);
      await updatedUser.update({
        trustScore: trustResult.score,
        lastScoreUpdate: new Date(),
      });

      res.status(201).json({
        success: true,
        data: {
          transaction,
          roundUpDetails: {
            baseAmount: mockPurchase.originalAmount,
            category: mockPurchase.category,
            multiplier: roundUp.multiplier,
            savedAmount: roundUp.savedAmount,
            roundedAmount: roundUp.roundedAmount,
          },
          trustScore: trustResult.score,
          scoreBreakdown: trustResult.breakdown,
          message: `${mockPurchase.merchantName} - $${mockPurchase.originalAmount} → saved $${roundUp.savedAmount} (${roundUp.multiplier}x ${mockPurchase.category})`,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET /api/transactions/:userId — Get all transactions for a user
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

  /**
   * POST /api/roundup/calculate  (Sub-Issue #2.5)
   * Standalone round-up preview — no transaction created.
   * Frontend can call this to show "what would happen" before confirming.
   */
  async calculateRoundUp(req, res) {
    try {
      const { amount, category, merchantName } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, error: 'amount must be a positive number' });
      }

      let result;
      if (merchantName && !category) {
        // Auto-categorize from merchant name
        result = RoundUpService.processTransaction(amount, merchantName);
      } else {
        result = RoundUpService.calculateRoundUp(amount, category || 'other');
      }

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  /**
   * GET /api/roundup/multipliers  (Sub-Issue #2.6)
   * Returns the full category multiplier config for frontend display.
   */
  async getMultipliers(req, res) {
    try {
      const config = RoundUpService.getMultiplierConfig();
      res.json({ success: true, data: config });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

module.exports = transactionController;
