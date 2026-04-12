import { supabase } from './supabase';
import { analyzeSide } from './scoring';
import type { TradeRow, NewTradeRow, TradeGradeSnapshot, TradeAsset } from '../types/database';
import type { PanelSlot } from '../components/TradePanel';

// ── Helpers ───────────────────────────────────────────────────────────────

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
    sideAPts:     A.totalPts,
    sideBPts:     B.totalPts,
    sideASurplus: A.totalSurplus,
    sideBSurplus: B.totalSurplus,
    sideADyn3yr:  A.dynSurplus,
    sideBDyn3yr:  B.dynSurplus,
    verdict,
    surplusMargin: +Math.abs(diff).toFixed(1),
    labelA,
    labelB,
  };
}

// ── CRUD ──────────────────────────────────────────────────────────────────

/** Fetch all trades, newest first. */
export async function fetchTrades(): Promise<TradeRow[]> {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .order('trade_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as TradeRow[];
}

/** Log a new trade from the calculator state. */
export async function logTrade(params: {
  sideA: PanelSlot[];
  sideB: PanelSlot[];
  ownerA: string;
  ownerB: string;
  tradeDate: string;   // 'YYYY-MM-DD'
  note?: string;
  labelA?: string;
  labelB?: string;
}): Promise<TradeRow> {
  const {
    sideA, sideB, ownerA, ownerB, tradeDate,
    note = null, labelA = 'Side A', labelB = 'Side B',
  } = params;

  const row: NewTradeRow = {
    trade_date:     tradeDate,
    note,
    side_a_owner:   ownerA.trim(),
    side_b_owner:   ownerB.trim(),
    side_a_assets:  slotsToAssets(sideA),
    side_b_assets:  slotsToAssets(sideB),
    grade_snapshot: computeGrade(sideA, sideB, labelA, labelB),
    retro_note:     null,
  };

  const { data, error } = await supabase
    .from('trades')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(row as any)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as TradeRow;
}

/** Add or update a retroactive note on a trade. */
export async function updateRetroNote(id: string, retroNote: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase
    .from('trades')
    .update({ retro_note: retroNote } as any)
    .eq('id', id);
  if (error) throw new Error(error.message);
}

/** Delete a trade record. */
export async function deleteTrade(id: string): Promise<void> {
  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

/** Derive the sorted list of all known owner names from trade history. */
export function knownOwners(trades: TradeRow[]): string[] {
  const names = new Set<string>();
  trades.forEach(t => { names.add(t.side_a_owner); names.add(t.side_b_owner); });
  return Array.from(names).sort();
}
