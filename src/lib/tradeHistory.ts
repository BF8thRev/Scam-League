/**
 * tradeHistory.ts  — localStorage backend (no Supabase required)
 *
 * Exports the same async API as the original Supabase version so
 * Verdict.tsx, HistoryPage.tsx, and TradeRecordCard.tsx all work unchanged.
 */

import { analyzeSide } from './scoring';
import { calculateDimensionScores } from './tradeRating';
import type { TradeRow, TradeGradeSnapshot, TradeAsset } from '../types/database';
import type { PanelSlot } from '../components/TradePanel';
import { PLAYERS } from '../data/players';

const STORAGE_KEY = 'scam-league-trades';

// ── Storage helpers ───────────────────────────────────────────────────────────

function readAll(): TradeRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TradeRow[]) : [];
  } catch {
    return [];
  }
}

function writeAll(trades: TradeRow[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function slotsToAssets(slots: PanelSlot[]): TradeAsset[] {
  return slots.map(({ player, cap }) => ({
    name:     player.name,
    playerId: player.id,
    cap,
    position: player.position,
  }));
}

function computeGrade(
  sideA: PanelSlot[],
  sideB: PanelSlot[],
  labelA: string,
  labelB: string,
): TradeGradeSnapshot {
  const A = analyzeSide(sideA);
  const B = analyzeSide(sideB);
  const diff = A.dynSurplus - B.dynSurplus;
  const threshold = 3;
  const verdict: 'A' | 'B' | 'FAIR' =
    diff >  threshold ? 'A' :
    diff < -threshold ? 'B' : 'FAIR';
  return {
    sideAPts:      A.totalPts,
    sideBPts:      B.totalPts,
    sideASurplus:  A.totalSurplus,
    sideBSurplus:  B.totalSurplus,
    sideADyn3yr:   A.dynSurplus,
    sideBDyn3yr:   B.dynSurplus,
    verdict,
    surplusMargin: +Math.abs(diff).toFixed(1),
    labelA,
    labelB,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Fetch all trades, newest first. */
export async function fetchTrades(): Promise<TradeRow[]> {
  const trades = readAll();
  return [...trades].sort((a, b) => {
    const d = b.trade_date.localeCompare(a.trade_date);
    return d !== 0 ? d : b.created_at.localeCompare(a.created_at);
  });
}

/** Log a new trade. */
export async function logTrade(params: {
  sideA: PanelSlot[];
  sideB: PanelSlot[];
  ownerA: string;
  ownerB: string;
  tradeDate: string;
  note?: string;
  labelA?: string;
  labelB?: string;
  adminOpinionRating?: number;
  adminOpinionComment?: string;
}): Promise<TradeRow> {
  const {
    sideA, sideB, ownerA, ownerB, tradeDate,
    note = null, labelA = 'Side A', labelB = 'Side B',
    adminOpinionRating, adminOpinionComment,
  } = params;

  // Calculate grade snapshot
  const gradeSnapshot = computeGrade(sideA, sideB, labelA, labelB);

  // Calculate dimension scores
  const playerMap = new Map(PLAYERS.map(p => [p.id, p]));
  const sideAPlayers = sideA.map(slot => playerMap.get(slot.player.id) || slot.player);
  const sideBPlayers = sideB.map(slot => playerMap.get(slot.player.id) || slot.player);

  const dimensionScores = calculateDimensionScores(
    {
      assets: slotsToAssets(sideA),
      players: sideAPlayers,
    },
    {
      assets: slotsToAssets(sideB),
      players: sideBPlayers,
    },
    gradeSnapshot.sideADyn3yr,
    gradeSnapshot.sideBDyn3yr,
    tradeDate,
    adminOpinionRating
  );

  // Infer calendar context from trade date
  const calendarContext = getCalendarContext(tradeDate);

  const now = new Date().toISOString();
  const trade: TradeRow = {
    id:             crypto.randomUUID(),
    trade_date:     tradeDate,
    note,
    side_a_owner:   ownerA.trim(),
    side_b_owner:   ownerB.trim(),
    side_a_assets:  slotsToAssets(sideA),
    side_b_assets:  slotsToAssets(sideB),
    grade_snapshot: gradeSnapshot,
    retro_note:     null,
    created_at:     now,
    updated_at:     now,
    admin_opinion_rating: adminOpinionRating,
    admin_opinion_comment: adminOpinionComment,
    calendar_context: calendarContext,
    dimension_scores: dimensionScores,
  };

  const trades = readAll();
  trades.push(trade);
  writeAll(trades);
  return trade;
}

/** Helper: Extract calendar context (month) from trade date */
function getCalendarContext(tradeDate: string): string {
  const date = new Date(tradeDate);
  const month = date.getMonth() + 1;
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  return months[Math.min(11, Math.max(0, month - 1))];
}

/** Add or update a retroactive note on a trade. */
export async function updateRetroNote(id: string, retroNote: string): Promise<void> {
  writeAll(
    readAll().map(t =>
      t.id === id
        ? { ...t, retro_note: retroNote || null, updated_at: new Date().toISOString() }
        : t
    )
  );
}

/** Delete a trade record. */
export async function deleteTrade(id: string): Promise<void> {
  writeAll(readAll().filter(t => t.id !== id));
}

/** Derive sorted list of all known owner names from trade history. */
export function knownOwners(trades: TradeRow[]): string[] {
  const names = new Set<string>();
  trades.forEach(t => { names.add(t.side_a_owner); names.add(t.side_b_owner); });
  return Array.from(names).sort();
}
