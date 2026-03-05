/**
 * TrustScoreService - Trust Score Calculator Engine (Issue #5)
 * Evaluates savings consistency to generate a score out of 1000
 */
class TrustScoreService {
  static MAX_SCORE = 1000;

  // Weight distribution for score components
  static WEIGHTS = {
    frequency: 0.35,     // How often the user saves (35%)
    volume: 0.25,        // Total amount saved (25%)
    streak: 0.25,        // Consecutive saving days/weeks (25%)
    consistency: 0.15,   // Regularity of saving pattern (15%)
  };

  /**
   * Calculate the Trust Score based on transaction history
   * @param {Array} transactions - Array of transaction records
   * @param {Object} user - User record with currentStreak, totalSaved
   * @returns {{ score: number, breakdown: Object }}
   */
  static calculate(transactions, user) {
    const frequencyScore = this._frequencyScore(transactions);
    const volumeScore = this._volumeScore(transactions);
    const streakScore = this._streakScore(user.currentStreak || 0);
    const consistencyScore = this._consistencyScore(transactions);

    const rawScore =
      frequencyScore * this.WEIGHTS.frequency +
      volumeScore * this.WEIGHTS.volume +
      streakScore * this.WEIGHTS.streak +
      consistencyScore * this.WEIGHTS.consistency;

    const finalScore = Math.min(Math.round(rawScore), this.MAX_SCORE);

    return {
      score: finalScore,
      breakdown: {
        frequency: Math.round(frequencyScore),
        volume: Math.round(volumeScore),
        streak: Math.round(streakScore),
        consistency: Math.round(consistencyScore),
      },
    };
  }

  /**
   * Frequency: More transactions = higher score (capped at 1000)
   */
  static _frequencyScore(transactions) {
    const count = transactions.length;
    // 50+ transactions = max score
    return Math.min((count / 50) * this.MAX_SCORE, this.MAX_SCORE);
  }

  /**
   * Volume: Higher total saved = higher score
   */
  static _volumeScore(transactions) {
    const totalSaved = transactions.reduce(
      (sum, tx) => sum + parseFloat(tx.savedAmount || 0), 0
    );
    // $100+ saved = max score
    return Math.min((totalSaved / 100) * this.MAX_SCORE, this.MAX_SCORE);
  }

  /**
   * Streak: Longer continuous saving streak = higher score
   */
  static _streakScore(currentStreak) {
    // 30-day streak = max score
    return Math.min((currentStreak / 30) * this.MAX_SCORE, this.MAX_SCORE);
  }

  /**
   * Consistency: How evenly spread out are the transactions over time
   */
  static _consistencyScore(transactions) {
    if (transactions.length < 2) return 0;

    const dates = transactions
      .map(tx => new Date(tx.createdAt).toDateString())
      .filter((date, i, arr) => arr.indexOf(date) === i); // unique days

    const uniqueDays = dates.length;
    const totalTx = transactions.length;

    // Ratio of unique days to total transactions (higher = more spread out = better)
    const spreadRatio = uniqueDays / totalTx;
    return Math.min(spreadRatio * this.MAX_SCORE * 2, this.MAX_SCORE);
  }
}

module.exports = TrustScoreService;
