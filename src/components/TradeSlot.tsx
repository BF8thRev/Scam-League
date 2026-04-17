import { useState } from 'react';
import { X, ChevronDown, ChevronUp, AlertTriangle, Info, TrendingDown } from 'lucide-react';
import { BaseballPlayer, Position, Warning } from '../types';
import { analyzePlayer } from '../lib/scoring';

const POS_BADGE: Record<Position, string> = {
  C:   'bg-sky-500/20 text-sky-300 border-sky-500/30',
  '1B':'bg-green-500/20 text-green-300 border-green-500/30',
  '2B':'bg-green-400/20 text-green-200 border-green-400/30',
  SS:  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  '3B':'bg-orange-500/20 text-orange-300 border-orange-500/30',
  OF:  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  SP:  'bg-red-500/20 text-red-300 border-red-500/30',
  RP:  'bg-pink-500/20 text-pink-300 border-pink-500/30',
  DH:  'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const WARN_ICON = {
  danger: <AlertTriangle size={12} className="text-red-400 flex-shrink-0 mt-0.5" />,
  warn:   <AlertTriangle size={12} className="text-yellow-400 flex-shrink-0 mt-0.5" />,
  info:   <Info size={12} className="text-blue-400 flex-shrink-0 mt-0.5" />,
};

const WARN_TEXT: Record<Warning['severity'], string> = {
  danger: 'text-red-300',
  warn:   'text-yellow-300',
  info:   'text-blue-300',
};

function CapBar({ surplus, maxSurplus }: { surplus: number; maxSurplus: number }) {
  const abs = Math.abs(surplus);
  const pct = maxSurplus > 0 ? Math.min((abs / maxSurplus) * 100, 100) : 0;
  const color = surplus >= 0 ? 'bg-emerald-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-1.5">
      {surplus < 0 && <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />}
      <div className="text-xs font-mono">
        <span className={surplus >= 0 ? 'text-emerald-400' : 'text-red-400'}>
          {surplus >= 0 ? '+' : ''}{surplus.toFixed(1)}
        </span>
      </div>
      {surplus >= 0 && <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />}
    </div>
  );
}

interface Props {
  player: BaseballPlayer;
  cap: number;
  onCapChange: (val: number) => void;
  onRemove: () => void;
}

export default function TradeSlot({ player, cap, onCapChange, onRemove }: Props) {
  const [expanded, setExpanded] = useState(false);
  const analysis = analyzePlayer(player, cap);
  const { pts, marketValue, surplus, capPath, warnings, breakdown } = analysis;

  const maxAbsSurplus = Math.max(...capPath.map(y => Math.abs(y.surplus)), 1);

  const surplusColor =
    surplus > 5  ? 'text-emerald-400' :
    surplus > 0  ? 'text-green-400'   :
    surplus > -5 ? 'text-yellow-400'  : 'text-red-400';

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
      {/* Header row */}
      <div className="flex items-start justify-between px-4 pt-3 pb-2">
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${POS_BADGE[player.position]}`}>
              {player.position}
            </span>
            <span className="text-white font-semibold text-sm">
              {player.name}
              {player.fantasyTeam && <span className="text-gray-400 font-normal"> ({player.fantasyTeam})</span>}
            </span>
          </div>
          <span className="text-gray-500 text-xs">{player.team} · Age {player.age}</span>
        </div>
        <button onClick={onRemove} className="text-gray-600 hover:text-red-400 transition-colors ml-2">
          <X size={15} />
        </button>
      </div>

      {/* Metrics row */}
      <div className="px-4 pb-3 grid grid-cols-3 gap-3">
        {/* Cap input */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Cap ($)</p>
          <input
            type="number"
            min={0}
            value={cap === 0 ? '' : cap}
            onChange={e => onCapChange(Math.max(0, Number(e.target.value) || 0))}
            placeholder="0"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-white outline-none focus:border-emerald-500 transition-colors font-mono"
          />
        </div>
        {/* Projected pts */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Proj. Pts</p>
          <p className="text-lg font-bold text-white font-mono leading-none pt-1">
            {pts.toFixed(0)}
          </p>
          <p className="text-xs text-gray-500">mkt ≈ ${marketValue.toFixed(1)}</p>
        </div>
        {/* Surplus */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Surplus</p>
          <p className={`text-lg font-bold font-mono leading-none pt-1 ${surplusColor}`}>
            {surplus >= 0 ? '+' : ''}{surplus.toFixed(1)}
          </p>
          <p className="text-xs text-gray-500">vs peer market</p>
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-800/50 text-xs text-gray-400 hover:text-gray-200 transition-colors border-t border-gray-700/50"
      >
        <span>Cap path · breakdown · flags</span>
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {expanded && (
        <div className="px-4 py-3 space-y-4 border-t border-gray-700/50">
          {/* Cap path */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Cap Path (3yr)</p>
            <div className="space-y-1.5">
              {capPath.map(yr => (
                <div key={yr.label} className="grid grid-cols-[60px_1fr_70px] gap-2 items-center">
                  <span className="text-xs text-gray-500">{yr.label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500/60"
                        style={{ width: `${Math.min((yr.pts / 1200) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-300 w-12 text-right">{yr.pts.toFixed(0)} pts</span>
                  </div>
                  <CapBar surplus={yr.surplus} maxSurplus={maxAbsSurplus} />
                </div>
              ))}
            </div>
            {(() => {
              const totalCapSurplus = capPath.reduce((s, y) => s + y.surplus, 0);
              return (
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-gray-500">3yr total surplus</span>
                  <span className={totalCapSurplus >= 0 ? 'text-emerald-400 font-mono' : 'text-red-400 font-mono'}>
                    {totalCapSurplus >= 0 ? '+' : ''}
                    {totalCapSurplus.toFixed(1)}
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Scoring breakdown */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Scoring Breakdown</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {Object.entries(breakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, val]) => (
                  <div key={cat} className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{cat}</span>
                    <span className={`text-xs font-mono ${Number(val) >= 0 ? 'text-gray-300' : 'text-red-400'}`}>
                      {Number(val) >= 0 ? '+' : ''}{val}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Flags</p>
              <div className="space-y-1.5">
                {warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    {WARN_ICON[w.severity]}
                    <p className={`text-xs leading-tight ${WARN_TEXT[w.severity]}`}>{w.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {warnings.length === 0 && (
            <div className="flex items-center gap-1.5">
              <TrendingDown size={12} className="text-gray-600" />
              <p className="text-xs text-gray-600">No flags for this player</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
