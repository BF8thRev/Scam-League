import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, Pencil, Check, X } from 'lucide-react';
import type { TradeRow } from '../types/database';
import { deleteTrade, updateRetroNote } from '../lib/tradeHistory';
import TradeRatingCard from './TradeRatingCard';

interface Props {
  trade: TradeRow;
  onDeleted: () => void;
  onUpdated: () => void;
}

const VERDICT_STYLES = {
  A:    { badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',    label: (a: string, _b: string) => `${a} won` },
  B:    { badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', label: (_a: string, b: string) => `${b} won` },
  FAIR: { badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', label: () => 'Fair trade' },
};

function fmtDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function surplusColor(v: number) {
  if (v > 3)  return 'text-emerald-400';
  if (v > 0)  return 'text-green-400';
  if (v > -3) return 'text-yellow-400';
  return 'text-red-400';
}

export default function TradeRecordCard({ trade, onDeleted, onUpdated }: Props) {
  const [expanded, setExpanded]     = useState(false);
  const [editRetro, setEditRetro]   = useState(false);
  const [retroText, setRetroText]   = useState(trade.retro_note ?? '');
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState(false);

  const g = trade.grade_snapshot;
  const vs = VERDICT_STYLES[g.verdict];

  async function saveRetro() {
    setSaving(true);
    try { await updateRetroNote(trade.id, retroText); onUpdated(); setEditRetro(false); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirm('Delete this trade record?')) return;
    setDeleting(true);
    try { await deleteTrade(trade.id); onDeleted(); }
    finally { setDeleting(false); }
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${vs.badge} flex-shrink-0`}>
            {vs.label(trade.side_a_owner, trade.side_b_owner)}
          </span>
          <span className="text-sm font-semibold text-white truncate">
            {trade.side_a_owner}
            <span className="text-gray-600 mx-1.5">↔</span>
            {trade.side_b_owner}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-500">{fmtDate(trade.trade_date)}</span>
          <button onClick={() => setExpanded(v => !v)} className="text-gray-600 hover:text-gray-300 transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={handleDelete} disabled={deleting} className="text-gray-700 hover:text-red-400 transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Surplus snapshot row */}
      <div className="px-4 pb-3 grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-800/60 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-500 mb-0.5">{trade.side_a_owner}</p>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-white font-semibold">{g.sideAPts.toFixed(0)}</span>
            <span className="text-xs text-gray-500">pts</span>
            <span className={`font-mono text-xs ml-auto ${surplusColor(g.sideADyn3yr)}`}>
              {g.sideADyn3yr >= 0 ? '+' : ''}{g.sideADyn3yr.toFixed(1)} 3yr
            </span>
          </div>
          <div className="mt-1 space-y-0.5">
            {trade.side_a_assets.map((a, i) => (
              <p key={i} className="text-xs text-gray-400">
                {a.position && <span className="text-gray-600 mr-1">{a.position}</span>}
                {a.name}
                <span className="text-gray-600 ml-1">${a.cap}</span>
              </p>
            ))}
          </div>
        </div>
        <div className="bg-gray-800/60 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-500 mb-0.5">{trade.side_b_owner}</p>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-white font-semibold">{g.sideBPts.toFixed(0)}</span>
            <span className="text-xs text-gray-500">pts</span>
            <span className={`font-mono text-xs ml-auto ${surplusColor(g.sideBDyn3yr)}`}>
              {g.sideBDyn3yr >= 0 ? '+' : ''}{g.sideBDyn3yr.toFixed(1)} 3yr
            </span>
          </div>
          <div className="mt-1 space-y-0.5">
            {trade.side_b_assets.map((a, i) => (
              <p key={i} className="text-xs text-gray-400">
                {a.position && <span className="text-gray-600 mr-1">{a.position}</span>}
                {a.name}
                <span className="text-gray-600 ml-1">${a.cap}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-800 pt-3">
          {trade.note && (
            <p className="text-xs text-gray-400 italic">"{trade.note}"</p>
          )}

          {/* Trade Rating */}
          {trade.dimension_scores && (
            <TradeRatingCard
              scores={trade.dimension_scores}
              adminOpinion={trade.admin_opinion_rating}
              adminComment={trade.admin_opinion_comment}
            />
          )}

          {/* Retro note */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Retro grade / notes</p>
              {!editRetro && (
                <button onClick={() => setEditRetro(true)} className="text-gray-600 hover:text-gray-300">
                  <Pencil size={12} />
                </button>
              )}
            </div>
            {editRetro ? (
              <div className="space-y-2">
                <textarea
                  value={retroText}
                  onChange={e => setRetroText(e.target.value)}
                  rows={3}
                  placeholder="How did this trade actually play out?"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 resize-none transition-colors"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveRetro}
                    disabled={saving}
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    <Check size={12} /> {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button onClick={() => { setEditRetro(false); setRetroText(trade.retro_note ?? ''); }}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300">
                    <X size={12} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                {trade.retro_note ?? <span className="text-gray-600 italic">No retro note yet.</span>}
              </p>
            )}
          </div>

          <p className="text-[10px] text-gray-700">
            Logged {new Date(trade.created_at).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
