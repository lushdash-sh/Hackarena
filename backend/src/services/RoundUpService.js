/**
 * RoundUpService — Issue #2: Categorization & Dynamic Rounding Logic
 *
 * Uses Hash Tables (JS Objects/Maps) for two core operations:
 *   1. CATEGORY_KEYWORDS  → merchant name → category classification
 *   2. CATEGORY_MULTIPLIERS → category → dynamic rounding multiplier
 *
 * Behavioral Economics:
 *   Discretionary spending (fast food, entertainment) gets penalized
 *   with higher round-ups to aggressively boost the savings pool.
 *   Educational spending is rewarded with lower round-ups.
 */
class RoundUpService {

  // ──────────────────────────────────────────────────────────
  // Sub-Issue #2.1 — Category Keyword Hash Map
  // Maps keywords (lowercase) → category strings
  // Used by categorize() for auto-detection from merchant names
  // ──────────────────────────────────────────────────────────
  static CATEGORY_KEYWORDS = {
    food: [
      'starbucks', 'mcdonald', 'chipotle', 'burger', 'pizza',
      'subway', 'taco', 'wendy', 'kfc', 'dunkin', 'domino',
      'popeyes', 'chick-fil-a', 'panera', 'five guys',
    ],
    entertainment: [
      'amc', 'netflix', 'hulu', 'disney', 'cinema', 'theatre',
      'theater', 'steam', 'xbox', 'playstation', 'twitch',
    ],
    transport: [
      'uber', 'lyft', 'gas', 'shell', 'chevron', 'parking',
      'transit', 'metro', 'bus', 'train', 'amtrak',
    ],
    groceries: [
      'walmart', 'target', 'kroger', 'costco', 'whole foods',
      'trader joe', 'aldi', 'safeway', 'publix', 'heb',
    ],
    subscriptions: [
      'spotify', 'apple', 'google', 'adobe', 'microsoft',
      'amazon prime', 'youtube', 'notion', 'dropbox',
    ],
    education: [
      'bookstore', 'university', 'college', 'tuition',
      'pearson', 'chegg', 'coursera', 'udemy', 'campus',
    ],
  };

  // ──────────────────────────────────────────────────────────
  // Sub-Issue #2.2 — Dynamic Multiplier Hash Map
  // Maps category → rounding multiplier
  // Higher multiplier = more aggressive savings
  // ──────────────────────────────────────────────────────────
  static CATEGORY_MULTIPLIERS = {
    food: 2,              // Fast food → 2x round-up penalty
    entertainment: 3,     // Entertainment → 3x aggressive round-up
    transport: 1,         // Transport → standard 1x
    groceries: 1,         // Groceries → standard 1x
    subscriptions: 1,     // Subscriptions → standard 1x
    education: 0.5,       // Education → 0.5x (reward learning)
    other: 1,             // Default → standard 1x
  };

  // Maximum round-up cap to prevent absurd savings deductions
  static MAX_ROUNDUP = 5.00;

  /**
   * Sub-Issue #2.1 — Categorize a merchant name using the keyword Hash Map.
   * Scans CATEGORY_KEYWORDS for a match against the merchant string.
   *
   * @param {string} merchantName — e.g. "Starbucks Coffee"
   * @returns {string} category — e.g. "food"
   */
  static categorize(merchantName) {
    const lower = merchantName.toLowerCase();
    for (const [category, keywords] of Object.entries(this.CATEGORY_KEYWORDS)) {
      if (keywords.some(keyword => lower.includes(keyword))) {
        return category;
      }
    }
    return 'other';
  }

  /**
   * Sub-Issue #2.2 — Calculate the dynamic round-up amount.
   *
   * Formula:
   *   baseRoundUp = ceil(amount) - amount          (basic spare change)
   *   if baseRoundUp === 0, use $1.00 as base      (exact dollar amounts)
   *   savedAmount = baseRoundUp × multiplier        (behavioral adjustment)
   *   savedAmount = min(savedAmount, MAX_ROUNDUP)   (cap protection)
   *
   * @param {number} originalAmount — the purchase price
   * @param {string} category — spending category
   * @returns {{ roundedAmount: number, savedAmount: number, multiplier: number, category: string }}
   */
  static calculateRoundUp(originalAmount, category) {
    const amount = parseFloat(originalAmount);
    const multiplier = this.CATEGORY_MULTIPLIERS[category] || 1;

    // Step 1: Calculate base round-up (spare change to next dollar)
    let baseRoundUp = Math.ceil(amount) - amount;
    baseRoundUp = parseFloat(baseRoundUp.toFixed(2));

    // Step 2: If exact dollar ($10.00), use $1.00 as base
    if (baseRoundUp === 0) {
      baseRoundUp = 1.00;
    }

    // Step 3: Apply category multiplier (behavioral economics)
    let savedAmount = parseFloat((baseRoundUp * multiplier).toFixed(2));

    // Step 4: Cap at maximum to prevent excessive deductions
    savedAmount = Math.min(savedAmount, this.MAX_ROUNDUP);

    // Step 5: Calculate what the user effectively "pays"
    const roundedAmount = parseFloat((amount + savedAmount).toFixed(2));

    return {
      roundedAmount,
      savedAmount,
      multiplier,
      category,
    };
  }

  /**
   * Convenience: auto-categorize + calculate in one call.
   * Used when the controller has a merchant name but no category.
   *
   * @param {number} originalAmount
   * @param {string} merchantName
   * @returns {{ roundedAmount, savedAmount, multiplier, category }}
   */
  static processTransaction(originalAmount, merchantName) {
    const category = this.categorize(merchantName);
    return this.calculateRoundUp(originalAmount, category);
  }

  /**
   * Sub-Issue #2.6 — Return the full multiplier config (for frontend display)
   */
  static getMultiplierConfig() {
    return Object.entries(this.CATEGORY_MULTIPLIERS).map(([category, multiplier]) => ({
      category,
      multiplier,
      description: this._getMultiplierDescription(multiplier),
    }));
  }

  static _getMultiplierDescription(multiplier) {
    if (multiplier > 1) return `${multiplier}x aggressive round-up`;
    if (multiplier < 1) return `${multiplier}x reduced round-up (rewarded)`;
    return '1x standard round-up';
  }
}

module.exports = RoundUpService;
