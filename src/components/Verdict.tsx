import { useState } from 'react';
import { Minus, TrendingUp, BookMarked, CheckCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { getWarnings, analyzeSide } from '../lib/scoring';
import { logTrade } from '../lib/tradeHistory';
import { PanelSlot } from './TradePanel';

interface Props {
  sideA: PanelSlot[];
  sideB: PanelSlot[];
  labelA: string;
  labelB: string;
  onTradeLogged?: () => void; // notify parent to refresh history
}

interface AggregatedWarning {
  side: string;
  playerName: string;
  message: string;
  severity: 'danger' | 'warn' | 'info';
}

function collectWarnings(slots: PanelSlot[], label: string): AggregatedWarning[] {
  return slots.flatMap(({ player, cap }) =>
    getWarnings(player, cap).map(w => ({
      side: label, playerName: player.name,
      message: w.message, severity: w.severity,
    }))
  );
}

const SEV_ORDER = { danger: 0, warn: 1, info: 2 };
const WARN_COLORS = {
  danger: { dot: 'bg-red-500',    text: 'text-red-300',    label: 'text-red-500 text-[10px] font-bold' },
  warn:   { dot: 'bg-yellow-500', text: 'text-yellow-300', label: 'text-yellow-500 text-[10px] font-bold' },
  info:   { dot: 'bg-blue-500',   text: 'text-blue-300',   label: 'text-blue-500 text-[10px] font-bold' },
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Verdict({ sideA, sideB, labelA, labelB, onTradeLogged }: Props) {
  // ── Log trade panel state ────────────────────────────────────────────────
  const [logOpen, setLogOpen]           = useState(false);
  const [ownerA, setOwnerA]             = useState('');
  const [ownerB, setOwnerB]             = useState('');
  const [tradeDate, setTradeDate]       = useState(todayISO);
  const [note, setNote]                 = useState('');
  const [adminOpinionRating, setAdminOpinionRating] = useState<number | undefined>();
  const [adminOpinionComment, setAdminOpinionComment] = useState('');
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [saveError, setSaveError]       = useState('');

  const A = analyzeSide(sideA);
  const B = analyzeSide(sideB);
  const surplusDiff = A.dynSurplus - B.dynSurplus;
  const ptsDiff = A.totalPts - B.totalPts;
  const threshold = 3;
  const winner =
    surplusDiff >  threshold ? 'A' :
    surplusDiff < -threshold ? 'B' : 'FAIR';

  const verdictConfig = {
    A:    { label: `${labelA} wins`, color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/30',       icon: <TrendingUp size={18} className="text-blue-400" /> },
    B:    { label: `${labelB} wins`, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: <TrendingUp size={18} className="text-emerald-400" /> },
    FAIR: { label: 'Fair trade',     color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/30',   icon: <Minus size={18} className="text-yellow-400" /> },
  }[winner];

  const allWarnings = [
    ...collectWarnings(sideA, labelA),
    ...collectWarnings(sideB, labelB),
  ].sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity]);

  async function handleLog(e: React.FormEvent) {
    e.preventDefault();
    if (!ownerA.trim() || !ownerB.trim()) return;
    setSaving(true);
    setSaveError('');
    try {
      await logTrade({
        sideA, sideB, ownerA, ownerB, tradeDate, note, labelA, labelB,
        adminOpinionRating,
        adminOpinionComment: adminOpinionComment.trim() || undefined,
      });
      setSaved(true);
      onTradeLogged?.();
      setTimeout(() => setSaved(false), 4000);
      // Reset form
      setAdminOpinionRating(undefined);
      setAdminOpinionComment('');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* ── Verdict banner ─────────────────────────────────────────────── */}
      <div className={`rounded-xl border px-5 py-4 ${verdictConfig.bg}`}>
        <div className="flex items-center gap-3 mb-3">
          {verdictConfig.icon}
          <span className={`text-xl font-black ${verdictConfig.color}`}>{verdictConfig.label}</span>
          {winner !== 'FAIR' && (
            <span className="text-xs text-gray-400 ml-auto">
              {Math.abs(surplusDiff).toFixed(1)} surplus advantage (3yr)
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-900/50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-500 mb-1">{labelA}</p>
            <p className="text-base font-bold text-white font-mono">{A.totalPts.toFixed(0)}</p>
            <p className="text-xs text-gray-500">pts</p>
            <p className={`text-sm font-mono mt-1 ${A.dynSurplus >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {A.dynSurplus >= 0 ? '+' : ''}{A.dynSurplus.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">3yr surplus</p>
          </div>

          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-gray-600 font-bold text-sm">vs</span>
            {ptsDiff !== 0 && (
              <span className={`text-xs ${ptsDiff > 0 ? 'text-blue-400' : 'text-emerald-400'}`}>
                {ptsDiff > 0 ? labelA : labelB} +{Math.abs(ptsDiff).toFixed(0)} pts
              </span>
            )}
          </div>

          <div className="bg-gray-900/50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-500 mb-1">{labelB}</p>
            <p className="text-base font-bold text-white font-mono">{B.totalPts.toFixed(0)}</p>
            <p className="text-xs text-gray-500">pts</p>
            <p className={`text-sm font-mono mt-1 ${B.dynSurplus >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {B.dynSurplus >= 0 ? '+' : ''}{B.dynSurplus.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">3yr surplus</p>
          </div>
        </div>

        {(A.totalCap > 0 || B.totalCap > 0) && (
          <div className="mt-3 flex justify-between text-xs text-gray-500 border-t border-gray-700/40 pt-2">
            <span>{labelA}: ${A.totalCap} cap · {A.totalSurplus >= 0 ? '+' : ''}{A.totalSurplus.toFixed(1)} surplus</span>
            <span>{labelB}: ${B.totalCap} cap · {B.totalSurplus >= 0 ? '+' : ''}{B.totalSurplus.toFixed(1)} surplus</span>
          </div>
        )}
      </div>

      {/* ── Trade flags ────────────────────────────────────────────────── */}
      {allWarnings.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Trade Flags</p>
          <div className="space-y-2">
            {allWarnings.map((w, i) => {
              const c = WARN_COLORS[w.severity];
              return (
                <div key={i} className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-1.5 flex-shrink-0`} />
                  <div>
                    <span className={c.label}>[{w.side} · {w.playerName}]</span>
                    <span className={`text-xs ml-1.5 ${c.text}`}>{w.message}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Log trade panel ────────────────────────────────────────────── */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
        <button
          onClick={() => setLogOpen(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookMarked size={14} />
            <span>Log this trade to history</span>
          </div>
          {logOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {logOpen && (
          <form onSubmit={handleLog} className="px-4 pb-4 space-y-3 border-t border-gray-800">
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">{labelA} owner</label>
                <input
                  required
                  value={ownerA}
                  onChange={e => setOwnerA(e.target.value)}
                  placeholder="Owner name"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">{labelB} owner</label>
                <input
                  required
                  value={ownerB}
                  onChange={e => setOwnerB(e.target.value)}
                  placeholder="Owner name"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Trade date</label>
                <input
                  type="date"
                  value={tradeDate}
                  onChange={e => setTradeDate(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Note (optional)</label>
                <input
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="e.g. deadline deal"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <label className="text-xs text-gray-500 block mb-2 font-semibold">Your Secret Sauce Opinion (optional)</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Rating (1-10)</label>
                  <select
                    value={adminOpinionRating ?? ''}
                    onChange={e => setAdminOpinionRating(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Unrated</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>{n}/10</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Why? (optional)</label>
                  <input
                    value={adminOpinionComment}
                    onChange={e => setAdminOpinionComment(e.target.value)}
                    placeholder="e.g. risky but smart"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {saveError && (
              <p className="text-xs text-red-400">{saveError}</p>
            )}

            <button
              type="submit"
              disabled={saving || saved}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg py-2.5 transition-colors"
            >
              {saving ? (
                <><Loader2 size={14} className="animate-spin" /> Saving…</>
              ) : saved ? (
                <><CheckCircle size={14} /> Logged</>
              ) : (
                <><BookMarked size={14} /> Log Trade</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
