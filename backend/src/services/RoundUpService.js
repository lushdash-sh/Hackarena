/**
 * RoundUpService - Categorization & Dynamic Rounding Logic (Issue #4)
 * Uses Hash Tables (objects) to map categories to dynamic multipliers.
 */
class RoundUpService {
  // Category multiplier map — discretionary spending gets penalized with higher round-ups
  static CATEGORY_MULTIPLIERS = {
    food: 2,              // Fast food → 2x round-up penalty
    entertainment: 3,     // Entertainment → 3x round-up (aggressive savings boost)
    transport: 1,         // Transport → standard 1x
    groceries: 1,         // Groceries → standard 1x
    subscriptions: 1,     // Subscriptions → standard 1x
    education: 0.5,       // Education → reduced 0.5x (encourage learning spending)
    other: 1,             // Default → standard 1x
  };

  /**
   * Calculate the round-up amount with dynamic behavioral multiplier.
   * @param {number} originalAmount - The original purchase amount
   * @param {string} category - The spending category
   * @returns {{ roundedAmount: number, savedAmount: number, multiplier: number }}
   */
  static calculateRoundUp(originalAmount, category) {
    const multiplier = RoundUpService.CATEGORY_MULTIPLIERS[category] || 1;
    const baseRoundUp = Math.ceil(originalAmount) - originalAmount;
    const adjustedSaving = baseRoundUp === 0 ? 1.00 * multiplier : +(baseRoundUp * multiplier).toFixed(2);

    return {
      roundedAmount: +(originalAmount + adjustedSaving).toFixed(2),
      savedAmount: adjustedSaving,
      multiplier,
    };
  }
}

module.exports = RoundUpService;
