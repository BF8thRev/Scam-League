/**
 * League-specific position analysis based on actual Scam League scoring
 * Calculated from all players scoring 300+ points (meaningful contributors)
 */

export interface PositionData {
  /** Number of meaningful players at this position (300+ pts) */
  count: number;
  /** Median points for this position (50th percentile) */
  replacement_level: number;
  /** Percentile thresholds for elite player tiers */
  percentiles: {
    50: number; // Median / replacement level
    75: number; // Good player
    90: number; // Very good player
    95: number; // Elite player
    99: number; // Superstar
  };
  /** Position scarcity score (0-1): fraction of players at 90th+ percentile */
  scarcity_score: number;
}

/**
 * LEAGUE_POSITION_DATA: Your league's position depth distribution
 *
 * Interpretation:
 * - scarcity_score: Higher = easier to find elite (0.50 = 50% of players are elite)
 * - Inverse scarcity: Lower scarcity_score = more valuable position
 * - Example: SS (0.13) is scarcer than OF (0.15), so elite SS > elite OF
 *
 * This is derived from calcPts() with actual Scam League multipliers
 * (1B=2, 2B=2.5, HR=5, W=25, SV=15, etc.)
 */
export const LEAGUE_POSITION_DATA: Record<string, PositionData> = {
  '1B': {
    count: 6,
    replacement_level: 837,
    percentiles: { 50: 837, 75: 896.5, 90: 942.5, 95: 942.5, 99: 942.5 },
    scarcity_score: 0.17,
  },
  '2B': {
    count: 5,
    replacement_level: 752,
    percentiles: { 50: 752, 75: 768, 90: 848, 95: 848, 99: 848 },
    scarcity_score: 0.2,
  },
  '3B': {
    count: 6,
    replacement_level: 785.5,
    percentiles: { 50: 785.5, 75: 821, 90: 960.5, 95: 960.5, 99: 960.5 },
    scarcity_score: 0.17,
  },
  'C': {
    count: 6,
    replacement_level: 604,
    percentiles: { 50: 604, 75: 727.5, 90: 752.5, 95: 752.5, 99: 752.5 },
    scarcity_score: 0.17,
  },
  'DH': {
    count: 2,
    replacement_level: 673,
    percentiles: { 50: 673, 75: 1088, 90: 1088, 95: 1088, 99: 1088 },
    scarcity_score: 0.5,
  },
  'OF': {
    count: 13,
    replacement_level: 789.5,
    percentiles: { 50: 789.5, 75: 894, 90: 986, 95: 1017, 99: 1017 },
    scarcity_score: 0.15,
  },
  'RP': {
    count: 12,
    replacement_level: 571.6,
    percentiles: { 50: 571.6, 75: 647, 90: 708, 95: 742.6, 99: 742.6 },
    scarcity_score: 0.17,
  },
  'SP': {
    count: 20,
    replacement_level: 737,
    percentiles: { 50: 737, 75: 797, 90: 846.4, 95: 853, 99: 904.8 },
    scarcity_score: 0.15,
  },
  'SS': {
    count: 8,
    replacement_level: 804,
    percentiles: { 50: 804, 75: 860.5, 90: 960, 95: 960, 99: 960 },
    scarcity_score: 0.13,
  },
};

/**
 * Helper: Get percentile tier for a player's points at their position
 * Returns the percentile the player falls into (50, 75, 90, 95, 99, or "below50")
 */
export function getPercentileTier(position: string, points: number): string {
  const data = LEAGUE_POSITION_DATA[position];
  if (!data) return 'unknown';

  const { percentiles } = data;
  if (points >= percentiles[99]) return '99';
  if (points >= percentiles[95]) return '95';
  if (points >= percentiles[90]) return '90';
  if (points >= percentiles[75]) return '75';
  if (points >= percentiles[50]) return '50';
  return 'below50';
}

/**
 * Helper: Calculate Points Above Replacement for a player
 * PAR = player_points - replacement_level
 */
export function calculatePAR(position: string, points: number): number {
  const data = LEAGUE_POSITION_DATA[position];
  if (!data) return 0;
  return Math.max(0, points - data.replacement_level);
}

/**
 * Helper: Get PAR multiplier based on position scarcity and player tier
 * Scarce positions get higher multipliers (e.g., SS gets more value per PAR than OF)
 * Elite tiers get higher multipliers (e.g., 99th%ile gets 2.0x, 50th%ile gets 0.8x)
 */
export function getPARMultiplier(position: string, percentileTier: string): number {
  const data = LEAGUE_POSITION_DATA[position];
  if (!data) return 1.0;

  // Base multiplier by scarcity: lower scarcity_score = higher multiplier (more valuable)
  // Scarcity range 0.13-0.5: invert to 7.7-2.0, normalize to 1.5-1.0 range
  const scarcityMultiplier = 1.0 + (1 - data.scarcity_score) * 0.5;

  // Tier multiplier: elite tiers are worth more than average
  const tierMultipliers: Record<string, number> = {
    '99': 2.0,
    '95': 1.6,
    '90': 1.3,
    '75': 1.1,
    '50': 1.0,
    'below50': 0.8,
  };

  const tierMult = tierMultipliers[percentileTier] || 1.0;
  return scarcityMultiplier * tierMult;
}
