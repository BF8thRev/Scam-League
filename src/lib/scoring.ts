import {
  BaseballPlayer,
  BatterStats,
  PitcherStats,
  isBatterStats,
  Warning,
  CapPathYear,
  PlayerAnalysis,
} from '../types';
import { getMarketValue } from './marketPricing';

// ── Scam League Scoring ───────────────────────────────────────────────────
// Batting: H=1 (all hits), 1B=1 bonus, 2B=1.5 bonus, 3B=2 bonus, HR=4 bonus
// → effective per hit: 1B=2, 2B=2.5, 3B=3, HR=5
export const SCORING = {
  // Batting (effective net values stored; H is baked in)
  SINGLE:  2,    // H(1) + 1B(1)
  DOUBLE:  2.5,  // H(1) + 2B(1.5)
  TRIPLE:  3,    // H(1) + 3B(2)
  HR_BAT:  5,    // H(1) + HR(4)
  RBI:     3,
  R:       1.5,
  BB:      0.5,
  K_BAT:  -0.5,
  SB:      2,

  // Pitching
  W:       25,
  SV:      15,
  CG:      15,
  SO_SHO:  10,   // Shutout (on top of CG)
  QS:       5,
  INN:      1.8,
  K_PIT:    0.6,
  ER:      -1.4,
  L:       -10,
  BS:      -15,
} as const;

/**
 * Linear calibration constant: champion target 12,500 pts / $225 active cap ≈ $55.6/pt.
 * Retained for ratio-based helpers (e.g. trade rating cap-efficiency score).
 * The headline `marketValue` / `surplus` now go through peer-tier pricing in
 * ./marketPricing which reads actual league caps rather than a flat rate.
 */
export const MARKET_RATE = 12500 / 225;

// ── Point calculators ─────────────────────────────────────────────────────
export function batterPts(s: BatterStats): number {
  return (
    s.singles * SCORING.SINGLE +
    s.doubles * SCORING.DOUBLE +
    s.triples * SCORING.TRIPLE +
    s.hr      * SCORING.HR_BAT +
    s.rbi     * SCORING.RBI    +
    s.r       * SCORING.R      +
    s.bb      * SCORING.BB     +
    s.k       * SCORING.K_BAT  +
    s.sb      * SCORING.SB
  );
}

export function pitcherPts(s: PitcherStats): number {
  return (
    s.w   * SCORING.W      +
    s.sv  * SCORING.SV     +
    s.cg  * SCORING.CG     +
    s.so  * SCORING.SO_SHO +
    s.qs  * SCORING.QS     +
    s.inn * SCORING.INN    +
    s.k   * SCORING.K_PIT  +
    s.er  * SCORING.ER     +
    s.l   * SCORING.L      +
    s.bs  * SCORING.BS
  );
}

export function calcPts(player: BaseballPlayer): number {
  return isBatterStats(player.stats)
    ? batterPts(player.stats)
    : pitcherPts(player.stats as PitcherStats);
}

// ── Breakdown display ─────────────────────────────────────────────────────
function batterBreakdown(s: BatterStats): Record<string, number> {
  const hits = s.singles + s.doubles + s.triples + s.hr;
  return {
    'HR (×5)':   +(s.hr      * SCORING.HR_BAT ).toFixed(1),
    'RBI (×3)':  +(s.rbi     * SCORING.RBI    ).toFixed(1),
    'R (×1.5)':  +(s.r       * SCORING.R      ).toFixed(1),
    'H (×1)':    +(hits       * 1              ).toFixed(1),
    '1B (×1)':   +(s.singles * 1              ).toFixed(1),
    '2B (×1.5)': +(s.doubles * 1.5            ).toFixed(1),
    '3B (×2)':   +(s.triples * 2              ).toFixed(1),
    'SB (×2)':   +(s.sb      * SCORING.SB     ).toFixed(1),
    'BB (×0.5)': +(s.bb      * SCORING.BB     ).toFixed(1),
    'K (×-0.5)': +(s.k       * SCORING.K_BAT  ).toFixed(1),
  };
}

function pitcherBreakdown(s: PitcherStats): Record<string, number> {
  return {
    'W (×25)':    +(s.w   * SCORING.W      ).toFixed(1),
    'INN (×1.8)': +(s.inn * SCORING.INN    ).toFixed(1),
    'SV (×15)':   +(s.sv  * SCORING.SV     ).toFixed(1),
    'K (×0.6)':   +(s.k   * SCORING.K_PIT  ).toFixed(1),
    'QS (×5)':    +(s.qs  * SCORING.QS     ).toFixed(1),
    'CG (×15)':   +(s.cg  * SCORING.CG     ).toFixed(1),
    'SHO (×10)':  +(s.so  * SCORING.SO_SHO ).toFixed(1),
    'ER (×-1.4)': +(s.er  * SCORING.ER     ).toFixed(1),
    'L (×-10)':   +(s.l   * SCORING.L      ).toFixed(1),
    'BS (×-15)':  +(s.bs  * SCORING.BS     ).toFixed(1),
  };
}

// ── Cap escalation (actual Scam League brackets) ──────────────────────────
/**
 * Returns the cap value for the NEXT year given current cap.
 * Brackets:
 *   1-3  → +4/yr
 *   4-8  → +3/yr
 *   9-13 → +2/yr
 *   14+  → +1/yr
 *   max  → 25 hard ceiling
 */
export function nextCap(cap: number): number {
  if (cap <= 0) return 0;
  if (cap >= 25) return 25;
  if (cap >= 14) return Math.min(cap + 1, 25);
  if (cap >= 9)  return Math.min(cap + 2, 25);
  if (cap >= 4)  return Math.min(cap + 3, 25);
  return Math.min(cap + 4, 25); // 1-3 bracket
}

// ── Aging curves ──────────────────────────────────────────────────────────
function batterAging(age: number): number {
  if (age <= 23) return 1.08;
  if (age <= 25) return 1.03;
  if (age <= 28) return 1.00;
  if (age <= 30) return 0.95;
  if (age <= 32) return 0.88;
  if (age <= 34) return 0.80;
  return 0.70;
}

function pitcherAging(age: number): number {
  // IP degrades faster than skills; use a slightly steeper curve
  if (age <= 25) return 1.05;
  if (age <= 28) return 1.00;
  if (age <= 30) return 0.96;
  if (age <= 32) return 0.90;
  if (age <= 34) return 0.82;
  return 0.72;
}

function agedPts(player: BaseballPlayer, yearsForward: number): number {
  if (yearsForward === 0) return calcPts(player);
  const ageFn = isBatterStats(player.stats) ? batterAging : pitcherAging;
  const base = ageFn(player.age);
  const future = ageFn(player.age + yearsForward);
  return +(calcPts(player) * (future / base)).toFixed(1);
}

// ── Warnings ──────────────────────────────────────────────────────────────
export function getWarnings(player: BaseballPlayer, cap: number): Warning[] {
  const warnings: Warning[] = [];
  const s = player.stats;
  const isBatter = isBatterStats(s);

  if (!isBatter) {
    const ps = s as PitcherStats;

    // IP ceiling: the hard-data threshold from 2025 actuals
    if (player.position === 'SP') {
      if (ps.inn < 150) {
        warnings.push({
          type: 'ip-ceiling',
          message: `Severe IP ceiling — ${ps.inn} projected INN places this SP in the 0% chance of 700+ pts bracket (avg 573 pts at this level)`,
          severity: 'danger',
        });
      } else if (ps.inn < 176) {
        warnings.push({
          type: 'ip-ceiling',
          message: `IP ceiling risk — ${ps.inn} projected INN is below the 176-INN threshold; 2025 data shows 0 SPs scored 700+ under 176 IP`,
          severity: 'warn',
        });
      }
    }

    // Closer premium + role fragility
    if (player.position === 'RP' && ps.sv > 0) {
      warnings.push({
        type: 'closer-premium',
        message: `Closer premium — ${ps.sv} projected saves, but role can evaporate in a week; use FA pickups for emergent closers instead of paying cap`,
        severity: 'warn',
      });
    }

    // BS damage (asymmetric — BS=-15 creates massive downside)
    if (ps.bs >= 8) {
      warnings.push({
        type: 'bs-damage',
        message: `BS damage alert — ${ps.bs} projected blown saves destroys ${ps.bs * 15} pts; a closer with 8 BS is 75 pts WORSE than one with 3 BS`,
        severity: 'danger',
      });
    } else if (ps.bs >= 5) {
      warnings.push({
        type: 'bs-damage',
        message: `BS exposure — ${ps.bs} projected BS costs ${ps.bs * 15} pts`,
        severity: 'warn',
      });
    }

    // Loss exposure (L=-10 is enormous for bad-team SPs)
    if (ps.l >= 12) {
      warnings.push({
        type: 'loss-exposure',
        message: `Loss exposure — ${ps.l} projected losses = ${ps.l * 10} pts lost; bad-team SPs are structurally capped by L penalty`,
        severity: 'danger',
      });
    } else if (ps.l >= 9) {
      warnings.push({
        type: 'loss-exposure',
        message: `L penalty risk — ${ps.l} projected losses costs ${ps.l * 10} pts`,
        severity: 'warn',
      });
    }

    // Rebuilder / bad team context (W=25 is king; team context is #1 factor)
    if (player.rebuilder) {
      warnings.push({
        type: 'team-context',
        message: `Rebuilding org — W=25 makes team context the #1 SP value driver; win projection on this team is structurally capped`,
        severity: 'danger',
      });
    }
  }

  // High cap
  if (cap >= 20) {
    const yr1 = nextCap(cap);
    const yr2 = nextCap(yr1);
    warnings.push({
      type: 'high-cap',
      message: `High-cap lock — escalates to $${yr1} → $${yr2} over 2 years; significant chunk of 225 budget committed`,
      severity: 'warn',
    });
  }

  // Age flags
  if (player.age >= 34) {
    warnings.push({
      type: 'age-decline',
      message: `Age ${player.age} — steep decline phase; scoring drops ~20% over 3 years in aging model`,
      severity: 'danger',
    });
  } else if (player.age >= 31) {
    warnings.push({
      type: 'age-decline',
      message: `Age ${player.age} — entering decline phase; monitor second-half stats and Statcast vitals`,
      severity: 'warn',
    });
  }

  if (player.age <= 23) {
    warnings.push({
      type: 'youth-upside',
      message: `Age ${player.age} — projections likely understate ceiling; xwOBA/xERA and sprint speed trends matter more than slash line`,
      severity: 'info',
    });
  }

  return warnings;
}

// ── Full analysis ─────────────────────────────────────────────────────────
export function analyzePlayer(player: BaseballPlayer, cap: number): PlayerAnalysis {
  const pts = +calcPts(player).toFixed(1);
  const marketValue = getMarketValue(player, pts);
  const surplus = +(marketValue - cap).toFixed(1);

  // Cap path uses actual escalation brackets, not flat cap
  const capPath: CapPathYear[] = (() => {
    const years: CapPathYear[] = [];
    let rollingCap = cap;
    for (let yr = 0; yr <= 2; yr++) {
      const p = agedPts(player, yr);
      const mv = getMarketValue(player, p);
      years.push({
        label: yr === 0 ? 'Y0 (now)' : `Y${yr}`,
        pts: +p.toFixed(1),
        cap: rollingCap,
        surplus: +(mv - rollingCap).toFixed(1),
      });
      rollingCap = nextCap(rollingCap);
    }
    return years;
  })();

  const breakdown = isBatterStats(player.stats)
    ? batterBreakdown(player.stats)
    : pitcherBreakdown(player.stats as PitcherStats);

  const warnings = getWarnings(player, cap);

  return { pts, marketValue, surplus, capPath, warnings, breakdown };
}

// ── Trade-level helpers ───────────────────────────────────────────────────
export interface SideAnalysis {
  totalPts: number;
  totalCap: number;
  totalMarketValue: number;
  totalSurplus: number;
  dynSurplus: number; // sum of 3-year surplus across all players (accounts for escalation)
}

export function analyzeSide(slots: { player: BaseballPlayer; cap: number }[]): SideAnalysis {
  let totalPts = 0, totalCap = 0, totalMV = 0, totalSurplus = 0, dynSurplus = 0;
  for (const { player, cap } of slots) {
    const a = analyzePlayer(player, cap);
    totalPts += a.pts;
    totalCap += cap;
    totalMV += a.marketValue;
    totalSurplus += a.surplus;
    dynSurplus += a.capPath.reduce((sum, y) => sum + y.surplus, 0);
  }
  return {
    totalPts:         +totalPts.toFixed(1),
    totalCap,
    totalMarketValue: +totalMV.toFixed(1),
    totalSurplus:     +totalSurplus.toFixed(1),
    dynSurplus:       +dynSurplus.toFixed(1),
  };
}
