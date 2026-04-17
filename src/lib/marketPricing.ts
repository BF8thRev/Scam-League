import { BaseballPlayer, isBatterStats } from '../types';
import { calcPts } from './scoring';
import { PLAYERS } from '../data/players';
import { ROSTERS } from '../data/rosters';

// ── Peer-tier market pricing ──────────────────────────────────────────────
// The idea: don't price points with a flat $/pt formula. Instead read what
// THIS league is actually paying for comparable production, then adjust for
// elite-tier ceiling and veteran reliability. This turns up real surplus
// where linear math says "fair market" — e.g., Bobby Witt at $17.

interface RostereePoint {
  name: string;
  pts: number;
  cap: number;
  age: number;
  isPitcher: boolean;
}

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ jr\.?$/, '')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

// Lazy build (avoids circular-import timing with scoring.ts).
let MARKET_CACHE: { batters: RostereePoint[]; pitchers: RostereePoint[] } | null = null;
function getMarket() {
  if (MARKET_CACHE) return MARKET_CACHE;
  const projByNorm = new Map<string, BaseballPlayer>();
  for (const p of PLAYERS) projByNorm.set(normalize(p.name), p);

  const batters: RostereePoint[] = [];
  const pitchers: RostereePoint[] = [];

  for (const roster of ROSTERS) {
    for (const rp of roster.players) {
      const proj = projByNorm.get(normalize(rp.name));
      if (!proj) continue;
      const pts = calcPts(proj);
      const entry: RostereePoint = {
        name: proj.name,
        pts,
        cap: rp.capValue,
        age: proj.age,
        isPitcher: !isBatterStats(proj.stats),
      };
      if (entry.isPitcher) pitchers.push(entry);
      else batters.push(entry);
    }
  }

  batters.sort((a, b) => b.pts - a.pts);
  pitchers.sort((a, b) => b.pts - a.pts);
  MARKET_CACHE = { batters, pitchers };
  return MARKET_CACHE;
}

function medianCap(peers: RostereePoint[]): number {
  const sorted = peers.map(p => p.cap).sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function meanCap(peers: RostereePoint[]): number {
  return peers.reduce((s, p) => s + p.cap, 0) / peers.length;
}

/**
 * Peer-tier market value: what would this player cost on the open trade
 * market given the caps this league is currently paying for similar pts?
 */
export function getMarketValue(player: BaseballPlayer, pts: number): number {
  const isPit = !isBatterStats(player.stats);
  const market = getMarket();
  const pool = isPit ? market.pitchers : market.batters;
  if (pool.length === 0) return +(pts / 55.56).toFixed(1); // fallback if data missing

  // Peer group: same pool within ±12% pts. Widen the band if it's too small.
  let band = 0.12;
  let peers = pool.filter(p => Math.abs(p.pts - pts) / Math.max(pts, 1) <= band);
  while (peers.length < 3 && band < 0.35) {
    band += 0.05;
    peers = pool.filter(p => Math.abs(p.pts - pts) / Math.max(pts, 1) <= band);
  }

  // Base: prefer whichever is higher — median or mean. The league tolerates
  // higher prices at elite tiers, so mean > median signals an active market.
  let mv = peers.length
    ? Math.max(medianCap(peers), meanCap(peers))
    : pts / 55.56;

  // Elite-tier ceiling uplift — top producers compete against a hard $25 cap,
  // not an average. A top-5 bat / top-5 SP effectively prices to $22-24.
  const ranked = pool;
  const rank = ranked.findIndex(p => p.pts <= pts) + 1 || ranked.length + 1;
  if (!isPit) {
    if (rank <= 5)       mv = Math.max(mv, 24);
    else if (rank <= 10) mv = Math.max(mv, 22);
    else if (rank <= 20) mv = Math.max(mv, 19);
  } else {
    if (rank <= 5)       mv = Math.max(mv, 22);
    else if (rank <= 12) mv = Math.max(mv, 19);
  }

  // Reliability premium — veterans (30+) with established production carry
  // lower projection variance. A $25 age-35 Freeman-type beats a $10 volatile
  // youngster over a 12,500-pt championship chase.
  if (player.age >= 30 && pts >= 750) {
    mv += 2;
  }

  // Hard ceiling at the league's cap cap.
  mv = Math.min(mv, 25);

  return +mv.toFixed(1);
}
