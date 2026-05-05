export const OPAL_SOLAR_PRICE_PER_UNIT = 4.5; // THB/Unit

/**
 * Calculates the optimal fraction of capital to bet using the Kelly Criterion.
 * Formula: f* = (bp - q) / b
 * Where:
 * b = net odds received (e.g., if you bet $1 and win $2, b=2)
 * p = probability of winning
 * q = probability of losing (1 - p)
 */
export function calculateKellyCriterion(b: number, p: number): number {
  if (b <= 0) {
    throw new Error("Net odds (b) must be greater than 0.");
  }
  if (p < 0 || p > 1) {
    throw new Error("Probability of winning (p) must be between 0 and 1.");
  }
  const q = 1 - p;
  const kellyFraction = (b * p - q) / b;
  return Math.max(0, kellyFraction); // Kelly fraction cannot be negative
}
