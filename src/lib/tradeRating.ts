/**
 * Trade Rating System
 * Calculates multi-dimensional ratings for trades using your league's data
 */

import { BaseballPlayer, DimensionScores, Position } from '../types';
import { calcPts, MARKET_RATE, analyzePlayer } from './scoring';
import {
  LEAGUE_POSITION_DATA,
  getPercentileTier,
  calculatePAR,
  getPARMultiplier,
} from './positionAnalysis';

export interface TradeAsset {
  name: string;
  playerId?: string;
  cap: number;
  position?: string;
}

export interface TradeSide {
  assets: TradeAsset[];
  players: (BaseballPlayer | null)[]; // null if player not found
}

/**
 * Calculate Cap Efficiency (0-10 scale)
 * Formula: Average Points-per-Cap ratio
 * Scale: 50 pts/$1 cap = baseline (5/10), 75 pts/$1 = excellent (9/10), 25 pts/$1 = poor (2/10)
 */
export function calculateCapEfficiency(
  totalPts: number,
  totalCap: number
): number {
  if (totalCap === 0) return 5; // neutral if no cap

  const ptsPerCap = totalPts / totalCap;
  const marketRate = MARKET_RATE; // 50 pts per $1

  // Linear scale: ptsPerCap / marketRate → [0, 2] range
  // Clamp to 0-10 scale
  const ratio = ptsPerCap / marketRate;
  const score = Math.min(10, Math.max(0, ratio * 5));
  return Math.round(score * 10) / 10;
}

/**
 * Calculate Position Value (0-10 scale)
 * Uses PAR (Points Above Replacement) weighted by position scarcity
 */
export function calculatePositionValue(
  assets: TradeAsset[],
  players: (BaseballPlayer | null)[]
): number {
  if (assets.length === 0) return 5; // neutral if no assets

  let totalWeightedPAR = 0;
  let assetCount = 0;

  assets.forEach((asset, idx) => {
    const player = players[idx];
    if (!player || !asset.position) return;

    const playerPts = calcPts(player);
    const par = calculatePAR(asset.position, playerPts);
    const tier = getPercentileTier(asset.position, playerPts);
    const multiplier = getPARMultiplier(asset.position, tier);

    totalWeightedPAR += par * multiplier;
    assetCount++;
  });

  if (assetCount === 0) return 5;

  // Average weighted PAR per asset
  const avgWeightedPAR = totalWeightedPAR / assetCount;

  // Scale: 0 PAR = 0/10, 500 PAR = 5/10, 1000 PAR = 10/10
  // Use logarithmic scale to avoid huge values
  const score = Math.min(10, Math.max(0, (avgWeightedPAR / 200) * 5));
  return Math.round(score * 10) / 10;
}

/**
 * Calculate MLB Team Context (0-10 scale)
 * Assess real-world MLB team stability/contention
 */
export function calculateMLBTeamContext(players: (BaseballPlayer | null)[]): number {
  if (players.length === 0) return 5;

  const teamScores: Record<string, number> = {
    // Contenders (0.9-1.0)
    'LAD': 1.0, 'NYY': 1.0, 'HOU': 0.95, 'ATL': 0.95, 'BOS': 0.9,

    // Mid-tier (0.6-0.8)
    'SF': 0.75, 'SD': 0.7, 'PHI': 0.75, 'WSH': 0.65, 'MIL': 0.8,
    'DET': 0.65, 'CWS': 0.6, 'NYM': 0.7, 'ARI': 0.7, 'TOR': 0.7,
    'TB': 0.75, 'KC': 0.65, 'MIN': 0.7, 'OAK': 0.55, 'SEA': 0.65,
    'LAA': 0.65, 'BAL': 0.7, 'STL': 0.75, 'TEX': 0.8, 'COL': 0.55,
    'CIN': 0.6,

    // Rebuilders/weak (0.3-0.5)
    'PIT': 0.4, 'CBB': 0.45, 'MIA': 0.5,
  };

  let totalScore = 0;
  let count = 0;

  players.forEach((p) => {
    if (!p) return;
    const score = teamScores[p.team] ?? 0.5;
    totalScore += score;
    count++;
  });

  if (count === 0) return 5;

  const avg = totalScore / count; // 0-1 range
  return Math.round(avg * 10);
}

/**
 * Calculate Dynasty Outlook (0-10 scale)
 * Based on existing 3-year dynasty surplus calculation
 * Scale: 0 surplus = 5/10, +5 pts = 9/10, -5 pts = 1/10
 */
export function calculateDynastyOutlook(dynSurplus: number): number {
  // dynSurplus is typically -10 to +20, map to 0-10 scale
  // -10 → 0/10, 0 → 5/10, +10 → 9/10
  const score = 5 + (dynSurplus / 2) * 0.5;
  return Math.round(Math.min(10, Math.max(0, score)) * 10) / 10;
}

/**
 * Calculate Season Timing Context (0-10 scale)
 * Decode strategic timing of the trade
 */
export function calculateSeasonTiming(tradeDate: string): number {
  const date = new Date(tradeDate);
  const month = date.getMonth() + 1; // 1-12

  // Base score starts at 5/10
  let score = 5;

  // April/May: Off-season thinking, long-term bets
  if (month >= 4 && month <= 5) {
    score = 6.5; // Slight bump for patient trading
  }
  // June: Mixed (contenders buying, rebuilders selling)
  else if (month === 6) {
    score = 5; // Neutral - context-dependent
  }
  // July+: Deadline urgency
  else if (month >= 7) {
    score = 5.5; // Slight bump for deadline premium
  }
  // Off-season (Jan-Mar, Dec)
  else {
    score = 6; // Positive for deliberate planning
  }

  return score;
}

/**
 * Calculate Risk Score (0-10 scale)
 * Separate from value - a trade can be fair but risky
 */
export function calculateRiskScore(players: (BaseballPlayer | null)[]): number {
  if (players.length === 0) return 5;

  let totalRisk = 0;
  let count = 0;

  players.forEach((p) => {
    if (!p) return;

    let risk = 5; // baseline

    // Age risk
    if (p.age <= 23) {
      risk += 2; // young players have upside/downside
    } else if (p.age >= 34) {
      risk += 3; // steep decline ahead
    } else if (p.age >= 31) {
      risk += 1; // entering decline phase
    }

    // Position-based risk
    const stats = p.stats;
    if ('sv' in stats && stats.sv > 0) {
      // Closer premium risk - role fragility
      risk += 2;
    }

    // Team risk
    const rebuilderTeams = ['OAK', 'PIT', 'CIN', 'COL'];
    if (rebuilderTeams.includes(p.team)) {
      risk += 2; // higher injury/trade risk on bad teams
    }

    totalRisk += risk;
    count++;
  });

  if (count === 0) return 5;

  const avg = Math.min(10, totalRisk / count);
  return Math.round(avg * 10) / 10;
}

/**
 * Master function: Calculate all dimension scores for a trade
 * @param sideA Assets for side A with their players
 * @param sideB Assets for side B with their players
 * @param sideADyn3yr 3-year dynasty surplus for side A (from existing calc)
 * @param sideBDyn3yr 3-year dynasty surplus for side B (from existing calc)
 * @param tradeDate Trade date for timing analysis
 * @param adminOpinionRating User's subjective opinion (1-10, or undefined)
 */
export function calculateDimensionScores(
  sideA: { assets: TradeAsset[]; players: (BaseballPlayer | null)[] },
  sideB: { assets: TradeAsset[]; players: (BaseballPlayer | null)[] },
  sideADyn3yr: number,
  sideBDyn3yr: number,
  tradeDate: string,
  adminOpinionRating?: number
): DimensionScores {
  // Calculate total points for each side
  const sideAPts = sideA.players.reduce(
    (sum, p) => sum + (p ? calcPts(p) : 0),
    0
  );
  const sideBPts = sideB.players.reduce(
    (sum, p) => sum + (p ? calcPts(p) : 0),
    0
  );

  // Calculate total cap for each side
  const sideACap = sideA.assets.reduce((sum, a) => sum + a.cap, 0);
  const sideBCap = sideB.assets.reduce((sum, a) => sum + a.cap, 0);

  // Calculate individual dimensions for each side
  const capEff_A = calculateCapEfficiency(sideAPts, sideACap);
  const capEff_B = calculateCapEfficiency(sideBPts, sideBCap);
  const cap_efficiency = (capEff_A + capEff_B) / 2;

  const posVal_A = calculatePositionValue(sideA.assets, sideA.players);
  const posVal_B = calculatePositionValue(sideB.assets, sideB.players);
  const position_value = (posVal_A + posVal_B) / 2;

  const mlbCtx_A = calculateMLBTeamContext(sideA.players);
  const mlbCtx_B = calculateMLBTeamContext(sideB.players);
  const mlb_team_context = (mlbCtx_A + mlbCtx_B) / 2;

  const dynOut_A = calculateDynastyOutlook(sideADyn3yr);
  const dynOut_B = calculateDynastyOutlook(sideBDyn3yr);
  const dynasty_outlook = (dynOut_A + dynOut_B) / 2;

  const season_timing = calculateSeasonTiming(tradeDate);

  const riskA = calculateRiskScore(sideA.players);
  const riskB = calculateRiskScore(sideB.players);
  const risk_score = (riskA + riskB) / 2;

  // Composite score: weighted average of 5 auto dimensions + admin opinion
  // If no admin opinion yet, use 5 (neutral)
  const adminOpinion = adminOpinionRating ?? 5;

  const composite_score = Math.round(
    (cap_efficiency * 0.25 +
      position_value * 0.15 +
      mlb_team_context * 0.1 +
      dynasty_outlook * 0.3 +
      season_timing * 0.1 +
      adminOpinion * 0.1) *
      10
  ) / 10;

  return {
    cap_efficiency: Math.round(cap_efficiency * 10) / 10,
    position_value: Math.round(position_value * 10) / 10,
    mlb_team_context: Math.round(mlb_team_context * 10) / 10,
    dynasty_outlook: Math.round(dynasty_outlook * 10) / 10,
    season_timing: Math.round(season_timing * 10) / 10,
    composite_score,
    risk_score: Math.round(risk_score * 10) / 10,
  };
}
