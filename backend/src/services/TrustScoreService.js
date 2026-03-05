/**
 * TrustScoreService - Trust Score Calculator Engine (Issue #3)
 * Evaluates savings consistency to generate a score out of 1000.
 *
 * Five dimensions:
 *   1. Frequency  — how many round-ups the user has done
 *   2. Volume     — total dollar amount saved
 *   3. Streak     — consecutive calendar days of saving
 *   4. Consistency — how evenly spaced transactions are (std-dev of gaps)
 *   5. Recency    — how recently the user last saved
 */

const { User, Transaction } = require('../models');

class TrustScoreService {
  static MAX_SCORE = 1000;

  // ── Sub-Issue #3.1: Rebalanced weights with recency ──────────────
  static WEIGHTS = {
    frequency:   0.25,
    volume:      0.20,
    streak:      0.20,
    consistency: 0.15,
    recency:     0.20,
  };

  // ── Main entry point ─────────────────────────────────────────────
  /**
   * Calculate the Trust Score based on transaction history.
   * @param {Array}  transactions - Sequelize Transaction instances
   * @param {Object} user         - Sequelize User instance
   * @returns {{ score: number, breakdown: Object }}
   */
  static calculate(transactions, user) {
    const frequencyScore   = this._frequencyScore(transactions);
    const volumeScore      = this._volumeScore(transactions);
    const streakScore      = this._streakScore(user.currentStreak || 0);
    const consistencyScore = this._consistencyScore(transactions);
    const recencyScore     = this._recencyScore(transactions);

    const rawScore =
      frequencyScore   * this.WEIGHTS.frequency +
      volumeScore      * this.WEIGHTS.volume +
      streakScore      * this.WEIGHTS.streak +
      consistencyScore * this.WEIGHTS.consistency +
      recencyScore     * this.WEIGHTS.recency;

    const finalScore = Math.min(Math.round(rawScore), this.MAX_SCORE);

    return {
      score: finalScore,
      breakdown: {
        frequency:   Math.round(frequencyScore),
        volume:      Math.round(volumeScore),
        streak:      Math.round(streakScore),
        consistency: Math.round(consistencyScore),
        recency:     Math.round(recencyScore),
      },
    };
  }

  // ── Sub-Issue #3.2: Streak tracking ──────────────────────────────
  /**
   * Call AFTER inserting a new transaction.
   * Compares the previous transaction's date to today:
   *   - same day       → no change
   *   - yesterday      → streak + 1
   *   - older / none   → reset to 1
   * @returns {number} updated streak value
   */
  static async updateStreak(userId) {
    const user = await User.findByPk(userId);

    // Second-most-recent tx (the one just inserted is the newest)
    const prevTx = await Transaction.findOne({
      where: { userId },
      order: [['createdAt', 'DESC']],
      offset: 1,
    });

    if (!prevTx) {
      // First ever transaction
      await user.update({ currentStreak: 1 });
      return 1;
    }

    const prevDate  = new Date(prevTx.createdAt).toDateString();
    const today     = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86_400_000).toDateString();

    if (prevDate === today) {
      // Already saved today — streak unchanged
      return user.currentStreak;
    } else if (prevDate === yesterday) {
      // Consecutive day — increment
      const newStreak = (user.currentStreak || 0) + 1;
      await user.update({ currentStreak: newStreak });
      return newStreak;
    } else {
      // Gap > 1 day — reset
      await user.update({ currentStreak: 1 });
      return 1;
    }
  }

  // ── Dimension scorers ────────────────────────────────────────────

  /**
   * Frequency: more transactions → higher score.
   * 50+ txs = max score.
   */
  static _frequencyScore(transactions) {
    const count = transactions.length;
    return Math.min((count / 50) * this.MAX_SCORE, this.MAX_SCORE);
  }

  /**
   * Volume: higher total saved → higher score.
   * $100+ saved = max score.
   */
  static _volumeScore(transactions) {
    const totalSaved = transactions.reduce(
      (sum, tx) => sum + parseFloat(tx.savedAmount || 0), 0
    );
    return Math.min((totalSaved / 100) * this.MAX_SCORE, this.MAX_SCORE);
  }

  /**
   * Streak: longer continuous saving streak → higher score.
   * 30-day streak = max score.
   */
  static _streakScore(currentStreak) {
    return Math.min((currentStreak / 30) * this.MAX_SCORE, this.MAX_SCORE);
  }

  // ── Sub-Issue #3.3: Improved consistency (std-dev of gaps) ───────
  /**
   * Consistency: measures how evenly spaced transactions are.
   * Uses coefficient of variation of time-gaps between consecutive txs.
   * CV → 0 = perfectly even (1000), CV ≥ 2 = very irregular (0).
   */
  static _consistencyScore(transactions) {
    if (transactions.length < 3) return 0;

    const sorted = [...transactions].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    // Calculate gaps in hours between consecutive transactions
    const gaps = [];
    for (let i = 1; i < sorted.length; i++) {
      const gap =
        (new Date(sorted[i].createdAt) - new Date(sorted[i - 1].createdAt)) / 3_600_000;
      gaps.push(gap);
    }

    const mean     = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const variance = gaps.reduce((sum, g) => sum + (g - mean) ** 2, 0) / gaps.length;
    const stdDev   = Math.sqrt(variance);

    // Coefficient of variation (lower = more consistent)
    const cv = mean > 0 ? stdDev / mean : 0;

    // CV 0 → 1000, CV 2+ → 0
    const score = Math.max(0, (1 - cv / 2)) * this.MAX_SCORE;
    return Math.min(score, this.MAX_SCORE);
  }

  // ── Sub-Issue #3.1: Recency scorer ───────────────────────────────
  /**
   * Recency: how recently the user last saved.
   *   < 24 h  → 1000
   *   24-72 h → 750
   *   72-168 h → 500
   *   168-336 h → 250
   *   > 336 h → 0
   */
  static _recencyScore(transactions) {
    if (transactions.length === 0) return 0;

    const mostRecent = transactions.reduce((latest, tx) => {
      const d = new Date(tx.createdAt);
      return d > latest ? d : latest;
    }, new Date(0));

    const hoursSince = (Date.now() - mostRecent.getTime()) / 3_600_000;

    if (hoursSince < 24)  return this.MAX_SCORE;       // 1000
    if (hoursSince < 72)  return this.MAX_SCORE * 0.75; // 750
    if (hoursSince < 168) return this.MAX_SCORE * 0.50; // 500
    if (hoursSince < 336) return this.MAX_SCORE * 0.25; // 250
    return 0;
  }
}

module.exports = TrustScoreService;
