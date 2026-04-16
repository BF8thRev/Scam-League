import { useState, useMemo, useEffect } from 'react';
import { RotateCcw, Users, History, Calculator, Zap } from 'lucide-react';
import { BaseballPlayer } from './types';
import { SCORING } from './lib/scoring';
import { PLAYERS } from './data/players';
import { loadRosters, fetchRostersFromSupabase } from './lib/rosterStorage';
import { isSupabaseConfigured } from './lib/supabase';
import { fetchTrades } from './lib/tradeHistory';
import TradePanel, { PanelSlot } from './components/TradePanel';
import Verdict from './components/Verdict';
import RostersPage from './components/RostersPage';
import HistoryPage from './components/HistoryPage';
import CommissionerDashboard from './components/CommissionerDashboard';

/** Merge saved roster overrides (fantasyTeam, capValue) into the player list. */
function buildEnrichedPlayers(): BaseballPlayer[] {
  const saved = loadRosters();
  if (!saved) return PLAYERS;
  return PLAYERS.map(p => {
    const ov = saved.data[p.id];
    if (!ov) return p;
    return {
      ...p,
      ...(ov.fantasyTeam != null ? { fantasyTeam: ov.fantasyTeam } : {}),
      ...(ov.capValue    != null ? { capValue:    ov.capValue    } : {}),
    };
  });
}

type View = 'calculator' | 'history' | 'rosters' | 'analytics';

const BATTING_KEY: [string, number][] = [
  ['HR', 4], ['RBI', 3], ['R', 1.5], ['SB', 2],
  ['3B', 2], ['2B', 1.5], ['H', 1], ['1B', 1],
  ['BB', 0.5], ['K', -0.5],
];

const PITCHING_KEY: [string, number][] = [
  ['W', SCORING.W], ['S', SCORING.SV], ['CG', SCORING.CG],
  ['SHO', SCORING.SO_SHO], ['QS', SCORING.QS], ['INN', SCORING.INN],
  ['K', SCORING.K_PIT], ['ER', SCORING.ER], ['L', SCORING.L],
  ['BS', SCORING.BS],
];

export default function App() {
  const [view, setView]   = useState<View>('calculator');
  const [sideA, setSideA] = useState<PanelSlot[]>([]);
  const [sideB, setSideB] = useState<PanelSlot[]>([]);
  const [historyKey, setHistoryKey] = useState(0);
  const [trades, setTrades] = useState<any[]>([]);

  // Load enriched players — from localStorage immediately, then refresh from Supabase if available
  const [enrichedPlayers, setEnrichedPlayers] = useState<typeof PLAYERS>(buildEnrichedPlayers);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchRostersFromSupabase().then(store => {
      if (!store) return;
      setEnrichedPlayers(PLAYERS.map(p => {
        const ov = store.data[p.id];
        if (!ov) return p;
        return {
          ...p,
          ...(ov.fantasyTeam != null ? { fantasyTeam: ov.fantasyTeam } : {}),
          ...(ov.capValue    != null ? { capValue:    ov.capValue    } : {}),
        };
      }));
    }).catch(() => {/* keep localStorage version */});
  }, []);

  // Load trades when analytics view is opened
  useEffect(() => {
    if (view === 'analytics') {
      fetchTrades().then(setTrades);
    }
  }, [view, historyKey]);

  const allUsedIds = useMemo(() => {
    const ids = new Set<string>();
    [...sideA, ...sideB].forEach(s => ids.add(s.player.id));
    return ids;
  }, [sideA, sideB]);

  function addTo(side: 'A' | 'B', player: BaseballPlayer) {
    // Pre-fill cap from saved roster data if available
    const cap = player.capValue ?? 0;
    const slot: PanelSlot = { player, cap };
    if (side === 'A') setSideA(p => [...p, slot]);
    else setSideB(p => [...p, slot]);
  }

  function capChange(side: 'A' | 'B', idx: number, cap: number) {
    const updater = (prev: PanelSlot[]) =>
      prev.map((s, i) => i === idx ? { ...s, cap } : s);
    if (side === 'A') setSideA(updater);
    else setSideB(updater);
  }

  function remove(side: 'A' | 'B', idx: number) {
    const updater = (prev: PanelSlot[]) => prev.filter((_, i) => i !== idx);
    if (side === 'A') setSideA(updater);
    else setSideB(updater);
  }

  function reset() { setSideA([]); setSideB([]); }

  // Rosters is a full-page takeover (has its own header/close button)
  if (view === 'rosters') {
    return <RostersPage onClose={() => setView('calculator')} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 px-4 lg:px-6 py-3 sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-lg font-black tracking-tight leading-none">
              <span className="text-emerald-400">SCAM</span>
              <span className="text-gray-600 font-light mx-1.5">·</span>
              <span className="text-white">LEAGUE</span>
            </h1>
            <p className="text-[10px] text-gray-600 mt-0.5">Dynasty Trade Calculator · Team 1987</p>
          </div>

          {/* Nav tabs */}
          <nav className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
            <button
              onClick={() => setView('calculator')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                view === 'calculator' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Calculator size={12} /> Calculator
            </button>
            <button
              onClick={() => setView('history')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                view === 'history' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <History size={12} /> History
            </button>
            <button
              onClick={() => setView('analytics')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                view === 'analytics' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Zap size={12} /> Analytics
            </button>
            <button
              onClick={() => setView('rosters')}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-colors text-gray-500 hover:text-gray-300"
            >
              <Users size={12} /> Rosters
            </button>
          </nav>

          {/* Scoring key — only on calculator, only on xl screens */}
          {view === 'calculator' && (
            <div className="hidden xl:flex items-start gap-4">
              <div>
                <p className="text-[9px] text-gray-700 uppercase tracking-widest mb-1">Batting</p>
                <div className="flex flex-wrap gap-x-1.5 gap-y-0">
                  {BATTING_KEY.map(([cat, val]) => (
                    <span key={cat} className={`text-[11px] font-mono ${val < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                      {cat}={val}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-px h-8 bg-gray-800 self-center" />
              <div>
                <p className="text-[9px] text-gray-700 uppercase tracking-widest mb-1">Pitching</p>
                <div className="flex flex-wrap gap-x-1.5 gap-y-0">
                  {PITCHING_KEY.map(([cat, val]) => (
                    <span key={cat} className={`text-[11px] font-mono ${val < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                      {cat}={val}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'calculator' && (
            <button
              onClick={reset}
              className="flex-shrink-0 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-600"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>
      </header>

      {/* ── Calculator ──────────────────────────────────────────────────── */}
      {view === 'calculator' && (
        <>
          {/* Mobile scoring key */}
          <div className="xl:hidden border-b border-gray-800 px-4 py-2">
            <div className="flex flex-wrap gap-x-2 gap-y-0">
              {[...BATTING_KEY, ...PITCHING_KEY].map(([cat, val]) => (
                <span key={cat} className={`text-[10px] font-mono ${val < 0 ? 'text-red-500' : 'text-gray-700'}`}>
                  {cat}={val}
                </span>
              ))}
            </div>
          </div>

          <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TradePanel
                label="Side A"
                color="blue"
                slots={sideA}
                allUsedIds={allUsedIds}
                onAdd={p => addTo('A', p)}
                onCapChange={(i, c) => capChange('A', i, c)}
                onRemove={i => remove('A', i)}
                players={enrichedPlayers}
              />
              <TradePanel
                label="Side B"
                color="emerald"
                slots={sideB}
                allUsedIds={allUsedIds}
                onAdd={p => addTo('B', p)}
                onCapChange={(i, c) => capChange('B', i, c)}
                onRemove={i => remove('B', i)}
                players={enrichedPlayers}
              />
            </div>

            {(sideA.length > 0 || sideB.length > 0) && (
              <Verdict
                sideA={sideA}
                sideB={sideB}
                labelA="Side A"
                labelB="Side B"
                onTradeLogged={() => setHistoryKey(k => k + 1)}
              />
            )}

            {sideA.length === 0 && sideB.length === 0 && (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">⚾</p>
                <p className="text-gray-400 font-semibold">Build a trade</p>
                <p className="text-gray-600 text-sm mt-1">
                  Search players on each side · enter cap values · get a verdict.
                </p>
                <p className="text-gray-700 text-xs mt-2">
                  50 pts / $1 cap · champion target ~12,500 pts · 225 cap budget
                </p>
              </div>
            )}
          </main>
        </>
      )}

      {/* ── History ─────────────────────────────────────────────────────── */}
      {view === 'history' && <HistoryPage key={historyKey} />}

      {/* ── Analytics ───────────────────────────────────────────────────── */}
      {view === 'analytics' && (
        <main className="max-w-6xl mx-auto px-4 py-6">
          <CommissionerDashboard trades={trades} />
        </main>
      )}
    </div>
  );
}
