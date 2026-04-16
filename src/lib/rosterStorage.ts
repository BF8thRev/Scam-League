import { supabase, isSupabaseConfigured } from './supabase';

const KEY = 'scam-league-rosters';

export interface RosterEntry {
  fantasyTeam?: string;
  capValue?: number;
}

export interface RosterStore {
  savedAt: string;
  data: Record<string, RosterEntry>;
}

// ── localStorage ──────────────────────────────────────────────────────────────

export function loadRosters(): RosterStore | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RosterStore;
  } catch {
    return null;
  }
}

export function saveRostersLocal(data: Record<string, RosterEntry>): string {
  const store: RosterStore = { savedAt: new Date().toISOString(), data };
  localStorage.setItem(KEY, JSON.stringify(store));
  return store.savedAt;
}

// ── Supabase ──────────────────────────────────────────────────────────────────

/**
 * Upserts all roster entries to the `rosters` table.
 * Each row: { player_id, fantasy_team, cap_value, updated_at }
 *
 * Required table (run once in Supabase SQL editor):
 *
 *   create table if not exists rosters (
 *     player_id    text primary key,
 *     fantasy_team text,
 *     cap_value    numeric,
 *     updated_at   timestamptz default now()
 *   );
 */
export async function saveRostersToSupabase(
  data: Record<string, RosterEntry>
): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');

  const rows = Object.entries(data).map(([player_id, entry]) => ({
    player_id,
    fantasy_team: entry.fantasyTeam ?? null,
    cap_value:    entry.capValue    ?? null,
    updated_at:   new Date().toISOString(),
  }));

  if (!rows.length) return;

  const { error } = await supabase
    .from('rosters')
    .upsert(rows, { onConflict: 'player_id' });

  if (error) throw new Error(error.message);
}

export async function fetchRostersFromSupabase(): Promise<RosterStore | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('rosters')
    .select('player_id, fantasy_team, cap_value, updated_at');

  if (error) throw new Error(error.message);
  if (!data?.length) return null;

  const entries: Record<string, RosterEntry> = {};
  let latestTs = '';
  for (const row of data) {
    entries[row.player_id] = {
      ...(row.fantasy_team != null ? { fantasyTeam: row.fantasy_team } : {}),
      ...(row.cap_value    != null ? { capValue:    Number(row.cap_value) } : {}),
    };
    if (row.updated_at > latestTs) latestTs = row.updated_at;
  }

  return { savedAt: latestTs || new Date().toISOString(), data: entries };
}

// ── Combined save (local + Supabase) ─────────────────────────────────────────

export async function saveRosters(
  data: Record<string, RosterEntry>
): Promise<{ savedAt: string; supabase: boolean }> {
  const savedAt = saveRostersLocal(data);
  let savedToSupabase = false;

  if (isSupabaseConfigured) {
    await saveRostersToSupabase(data);
    savedToSupabase = true;
  }

  return { savedAt, supabase: savedToSupabase };
}
