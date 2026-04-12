import type { TradeRow, TradeAsset } from '../types/database';

export interface OwnerStats {
  name: string;
  totalTrades: number;
  wins: number;
  losses: number;
  fair: number;
  winPct: number;          // wins / (wins + losses), ignoring fair
  avgSurplusGained: number; // positive = they gained surplus on avg
  totalSurplusGained: number;
  tendencies: Tendency[];
  recentTrades: TradeRow[];  // last 5
}

export interface Tendency {
  label: string;
  detail: string;
  severity: 'exploit' | 'note' | 'strength';
}

// ── Core derivation ───────────────────────────────────────────────────────

/**
 * For a given owner, pull their perspective from each trade:
 *   - verdict: did THEY win, lose, or draw?
 *   - surplusGained: their 3yr surplus minus opponent's 3yr surplus
 */
function ownerPerspective(owner: string, trade: TradeRow) {
  const { grade_snapshot: g, side_a_owner, side_b_owner } = trade;
  if (side_a_owner === owner) {
    return {
      verdict:       g.verdict === 'A' ? 'W' : g.verdict === 'B' ? 'L' : 'F',
      surplusGained: g.sideADyn3yr - g.sideBDyn3yr,
      gave:          trade.side_a_assets,
      got:           trade.side_b_assets,
    };
  }
  if (side_b_owner === owner) {
    return {
      verdict:       g.verdict === 'B' ? 'W' : g.verdict === 'A' ? 'L' : 'F',
      surplusGained: g.sideBDyn3yr - g.sideADyn3yr,
      gave:          trade.side_b_assets,
      got:           trade.side_a_assets,
    };
  }
  return null;
}

function detectTendencies(
  perspectives: ReturnType<typeof ownerPerspective>[],
  allTrades: TradeRow[],
): Tendency[] {
  const tendencies: Tendency[] = [];
  const valid = perspectives.filter(Boolean) as NonNullable<ReturnType<typeof ownerPerspective>>[];
  if (valid.length < 2) return tendencies;

  // — Consistently buys high-cap players
  const highCapGot = valid.filter(p =>
    p.got.some((a: TradeAsset) => a.cap >= 18)
  );
  if (highCapGot.length / valid.length >= 0.5) {
    tendencies.push({
      label: 'High-cap buyer',
      detail: `Receives $18+ cap players in ${highCapGot.length}/${valid.length} trades — possibly over-values proven vets`,
      severity: 'exploit',
    });
  }

  // — Sells youth (age implied by position youth proxy: looks for low-cap assets given away)
  const soldCheap = valid.filter(p =>
    p.gave.some((a: TradeAsset) => a.cap <= 4)
  );
  if (soldCheap.length / valid.length >= 0.5) {
    tendencies.push({
      label: 'Sells cheap assets',
      detail: `Gives up cap 1-4 assets in ${soldCheap.length}/${valid.length} trades — may undervalue young/cheap contributors`,
      severity: 'exploit',
    });
  }

  // — Closer hoarder
  const boughtRP = valid.filter(p =>
    p.got.some((a: TradeAsset) => a.position === 'RP')
  );
  if (boughtRP.length / valid.length >= 0.4) {
    tendencies.push({
      label: 'Closer premium',
      detail: `Acquires RPs in ${boughtRP.length}/${valid.length} trades — target this with SP-for-RP deals`,
      severity: 'exploit',
    });
  }

  // — Sells RPs frequently (good trade partner for closer deals)
  const soldRP = valid.filter(p =>
    p.gave.some((a: TradeAsset) => a.position === 'RP')
  );
  if (soldRP.length / valid.length >= 0.4) {
    tendencies.push({
      label: 'RP seller',
      detail: `Moves RPs in ${soldRP.length}/${valid.length} trades — good target when you need closer depth`,
      severity: 'note',
    });
  }

  // — Consistent loser (mark)
  const losses = valid.filter(p => p.verdict === 'L').length;
  if (losses / valid.length >= 0.55 && valid.length >= 3) {
    tendencies.push({
      label: 'Favourable trade partner',
      detail: `Lost the trade grade in ${losses}/${valid.length} trades — look to engage early in off-season`,
      severity: 'exploit',
    });
  }

  // — Consistent winner (shark)
  const wins = valid.filter(p => p.verdict === 'W').length;
  if (wins / valid.length >= 0.55 && valid.length >= 3) {
    tendencies.push({
      label: 'Sharp trader',
      detail: `Won grade in ${wins}/${valid.length} trades — approach carefully; don't negotiate under time pressure`,
      severity: 'note',
    });
  }

  return tendencies;
}

// ── Public API ─────────────────────────────────────────────────────────────

export function buildOwnerStats(owner: string, trades: TradeRow[]): OwnerStats {
  const ownerTrades = trades.filter(
    t => t.side_a_owner === owner || t.side_b_owner === owner
  );

  const perspectives = ownerTrades.map(t => ownerPerspective(owner, t));
  const valid = perspectives.filter(Boolean) as NonNullable<ReturnType<typeof ownerPerspective>>[];

  const wins   = valid.filter(p => p.verdict === 'W').length;
  const losses = valid.filter(p => p.verdict === 'L').length;
  const fair   = valid.filter(p => p.verdict === 'F').length;
  const decisive = wins + losses;

  const totalSurplusGained = +valid
    .reduce((sum, p) => sum + p.surplusGained, 0)
    .toFixed(1);

  return {
    name: owner,
    totalTrades: ownerTrades.length,
    wins,
    losses,
    fair,
    winPct: decisive > 0 ? +(wins / decisive).toFixed(2) : 0,
    avgSurplusGained: ownerTrades.length > 0
      ? +(totalSurplusGained / ownerTrades.length).toFixed(1)
      : 0,
    totalSurplusGained,
    tendencies: detectTendencies(perspectives, ownerTrades),
    recentTrades: ownerTrades.slice(0, 5),
  };
}

export function buildAllOwnerStats(trades: TradeRow[]): OwnerStats[] {
  const owners = new Set<string>();
  trades.forEach(t => { owners.add(t.side_a_owner); owners.add(t.side_b_owner); });
  return Array.from(owners)
    .map(o => buildOwnerStats(o, trades))
    .sort((a, b) => b.totalTrades - a.totalTrades);
}
