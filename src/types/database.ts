// Minimal hand-rolled Supabase type so we get typed queries
// without needing the CLI type-gen step.

import { DimensionScores } from './index';

export interface TradeRow {
  id: string;
  trade_date: string;          // 'YYYY-MM-DD'
  note: string | null;
  side_a_owner: string;
  side_b_owner: string;
  side_a_assets: TradeAsset[];
  side_b_assets: TradeAsset[];
  grade_snapshot: TradeGradeSnapshot;
  retro_note: string | null;
  created_at: string;
  updated_at: string;
  // New trade rating fields
  admin_opinion_rating?: number;      // 1-10: Your subjective quality score
  admin_opinion_comment?: string;     // Why you rated it that way
  calendar_context?: string;          // 'january' | 'april' | 'june' | 'july' | etc.
  dimension_scores?: DimensionScores; // All calculated rating dimensions
}

export interface TradeAsset {
  name: string;
  playerId?: string;
  cap: number;
  position?: string;
}

export interface TradeGradeSnapshot {
  sideAPts: number;
  sideBPts: number;
  sideASurplus: number;
  sideBSurplus: number;
  sideADyn3yr: number;
  sideBDyn3yr: number;
  verdict: 'A' | 'B' | 'FAIR';
  surplusMargin: number;     // absolute value of dynasty surplus diff
  labelA: string;
  labelB: string;
}

export type NewTradeRow = Omit<TradeRow, 'id' | 'created_at' | 'updated_at'>;

// Typed DB wrapper (subset — only the tables we use)
export interface Database {
  public: {
    Tables: {
      trades: {
        Row: TradeRow;
        Insert: NewTradeRow;
        Update: Partial<NewTradeRow>;
      };
    };
  };
}
