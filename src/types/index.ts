export type Position = 'C' | '1B' | '2B' | 'SS' | '3B' | 'OF' | 'SP' | 'RP' | 'DH';

export interface BatterStats {
  singles: number; // 1B — net 2pts (H=1 + 1B=1)
  doubles: number; // 2B — net 2.5pts (H=1 + 2B=1.5)
  triples: number; // 3B — net 3pts (H=1 + 3B=2)
  hr: number;      // HR — net 5pts (H=1 + HR=4)
  rbi: number;
  r: number;
  bb: number;
  k: number;       // negative
  sb: number;
}

export interface PitcherStats {
  w: number;    // Wins     +25
  sv: number;   // Saves    +15
  cg: number;   // CG       +15
  so: number;   // Shutouts +10 (in addition to CG)
  qs: number;   // QS        +5
  inn: number;  // Innings  +1.8/inn
  k: number;    // K        +0.6
  er: number;   // ER       -1.4
  l: number;    // Losses   -10
  bs: number;   // BS       -15
}

export function isBatterStats(s: BatterStats | PitcherStats): s is BatterStats {
  return 'singles' in s;
}

export interface BaseballPlayer {
  id: string;
  name: string;
  position: Position;
  team: string;
  age: number;
  stats: BatterStats | PitcherStats;
  /** True if pitcher is on a rebuilding/losing org — caps W ceiling */
  rebuilder?: boolean;
  fantasyTeam?: string;
  capValue?: number;
}

export interface Warning {
  type:
    | 'ip-ceiling'
    | 'closer-premium'
    | 'bs-damage'
    | 'high-cap'
    | 'age-decline'
    | 'youth-upside'
    | 'team-context'
    | 'loss-exposure';
  message: string;
  severity: 'danger' | 'warn' | 'info';
}

export interface CapPathYear {
  label: string;
  pts: number;
  cap: number;    // escalated cap for that year
  surplus: number;
}

export interface PlayerAnalysis {
  pts: number;
  marketValue: number;
  surplus: number;
  capPath: CapPathYear[];
  warnings: Warning[];
  breakdown: Record<string, number>;
}

export interface TradeSlot {
  player: BaseballPlayer;
  cap: number;
}
