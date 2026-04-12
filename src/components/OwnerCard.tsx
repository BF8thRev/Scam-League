import type { OwnerStats } from '../lib/ownerAnalysis';

interface Props {
  stats: OwnerStats;
  isYou?: boolean;
}

const TENDENCY_COLORS = {
  exploit:  'bg-red-500/15 text-red-300 border-red-500/25',
  note:     'bg-yellow-500/15 text-yellow-300 border-yellow-500/25',
  strength: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
};

function WinBar({ wins, losses, fair }: { wins: number; losses: number; fair: number }) {
  const total = wins + losses + fair;
  if (total === 0) return null;
  const wPct = (wins   / total) * 100;
  const lPct = (losses / total) * 100;
  const fPct = (fair   / total) * 100;
  return (
    <div className="flex h-1.5 rounded-full overflow-hidden gap-px w-full">
      {wPct > 0 && <div className="bg-emerald-500" style={{ width: `${wPct}%` }} />}
      {fPct > 0 && <div className="bg-yellow-500" style={{ width: `${fPct}%` }} />}
      {lPct > 0 && <div className="bg-red-500"    style={{ width: `${lPct}%` }} />}
    </div>
  );
}

export default function OwnerCard({ stats, isYou }: Props) {
  const { name, totalTrades, wins, losses, fair, winPct, avgSurplusGained, tendencies } = stats;

  const surplusColor =
    avgSurplusGained >  2 ? 'text-emerald-400' :
    avgSurplusGained >= 0 ? 'text-gray-300'    :
    avgSurplusGained > -2 ? 'text-yellow-400'  : 'text-red-400';

  return (
    <div className={`bg-gray-900 rounded-xl border p-4 space-y-3 ${isYou ? 'border-emerald-500/40' : 'border-gray-700'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-white text-sm">{name}</p>
          {isYou && <span className="text-[10px] text-emerald-400 font-semibold">YOU</span>}
        </div>
        <div className="text-right">
          <p className={`text-sm font-bold font-mono ${surplusColor}`}>
            {avgSurplusGained >= 0 ? '+' : ''}{avgSurplusGained.toFixed(1)}
          </p>
          <p className="text-[10px] text-gray-600">avg surplus/trade</p>
        </div>
      </div>

      {totalTrades > 0 ? (
        <>
          <WinBar wins={wins} losses={losses} fair={fair} />
          <div className="grid grid-cols-4 gap-1 text-center text-xs">
            <div>
              <p className="font-bold text-white">{totalTrades}</p>
              <p className="text-gray-600">trades</p>
            </div>
            <div>
              <p className="font-bold text-emerald-400">{wins}</p>
              <p className="text-gray-600">won</p>
            </div>
            <div>
              <p className="font-bold text-red-400">{losses}</p>
              <p className="text-gray-600">lost</p>
            </div>
            <div>
              <p className="font-bold text-yellow-400">
                {(winPct * 100).toFixed(0)}%
              </p>
              <p className="text-gray-600">win %</p>
            </div>
          </div>

          {tendencies.length > 0 && (
            <div className="space-y-1.5">
              {tendencies.map((t, i) => (
                <div key={i} className={`text-xs px-2 py-1.5 rounded-lg border ${TENDENCY_COLORS[t.severity]}`}>
                  <span className="font-semibold">{t.label} — </span>
                  <span className="opacity-80">{t.detail}</span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-xs text-gray-600">No trades logged yet.</p>
      )}
    </div>
  );
}
