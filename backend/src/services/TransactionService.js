/**
 * TransactionService — Issue #1: Mock Transaction Generator
 * 
 * ONLY generates raw purchase data simulating a user spending money.
 * No rounding logic here — that's Issue #2's job (RoundUpService).
 */

const MERCHANTS = [
  { name: 'Starbucks', category: 'food', minAmount: 3.00, maxAmount: 7.50 },
  { name: 'Spotify', category: 'subscriptions', minAmount: 9.99, maxAmount: 9.99 },
  { name: 'Netflix', category: 'subscriptions', minAmount: 15.49, maxAmount: 15.49 },
  { name: 'Uber', category: 'transport', minAmount: 5.00, maxAmount: 25.00 },
  { name: 'McDonald\'s', category: 'food', minAmount: 4.50, maxAmount: 12.00 },
  { name: 'Amazon', category: 'other', minAmount: 8.00, maxAmount: 120.00 },
  { name: 'Walmart Grocery', category: 'groceries', minAmount: 15.00, maxAmount: 85.00 },
  { name: 'AMC Theatres', category: 'entertainment', minAmount: 12.00, maxAmount: 22.00 },
  { name: 'Campus Bookstore', category: 'education', minAmount: 20.00, maxAmount: 150.00 },
  { name: 'Lyft', category: 'transport', minAmount: 6.00, maxAmount: 30.00 },
  { name: 'Chipotle', category: 'food', minAmount: 8.50, maxAmount: 14.00 },
  { name: 'Target', category: 'groceries', minAmount: 10.00, maxAmount: 60.00 },
  { name: 'Steam Games', category: 'entertainment', minAmount: 4.99, maxAmount: 59.99 },
  { name: 'Coursera', category: 'education', minAmount: 39.00, maxAmount: 49.00 },
];

class TransactionService {
  /**
   * Generate a random mock transaction for a given user.
   * Returns ONLY raw purchase data: merchantName, originalAmount, category.
   */
  static generateMockTransaction(userId) {
    const merchant = MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];
    const originalAmount = TransactionService._randomAmount(merchant.minAmount, merchant.maxAmount);

    return {
      userId,
      merchantName: merchant.name,
      originalAmount,
      category: merchant.category,
    };
  }

  /**
   * Generate a random dollar amount between min and max, to 2 decimal places.
   */
  static _randomAmount(min, max) {
    return +(Math.random() * (max - min) + min).toFixed(2);
  }
}

module.exports = TransactionService;
